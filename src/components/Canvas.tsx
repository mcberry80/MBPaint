import React, { useState, useRef, useEffect } from 'react';

interface CanvasProps {
  canvasWidth: number;
  canvasHeight: number;
}

const Canvas: React.FC<CanvasProps> = ({ canvasWidth, canvasHeight }) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedThickness, setSelectedThickness] = useState(15);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleCanvasMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (selectedColor) {
      const canvasContext = canvas.getContext('2d');

      if (canvasContext) {
        canvasContext.fillStyle = selectedColor;
        canvasContext.beginPath();
        canvasContext.arc(x, y, selectedThickness, 0, 2 * Math.PI);
        canvasContext.fill();
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (selectedColor) {
        const canvasContext = canvas.getContext('2d');
        if (canvasContext) {
          canvasContext.strokeStyle = selectedColor;
          canvasContext.lineWidth = selectedThickness;
          canvasContext.lineTo(x, y);
          canvasContext.stroke();
        }
      }
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext('2d');
      if (canvasContext) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.stroke();
        
      }
      startDrawing();
      setRedoStack([]);
    }
  };

  const handleCanvasMouseUp = () => {
    stopDrawing();
    saveCanvasState();
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleThicknessChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedThickness(Number(event.target.value));
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext('2d');
      if (canvasContext) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      }
      setUndoStack([]);
      setRedoStack([]);
    }
  };

  const handleUndo = () => {
    if (canvasRef.current && undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      const canvas = canvasRef.current;
      const canvasContext = canvas?.getContext('2d');
      if (canvasContext) {
        setUndoStack(undoStack.slice(0, undoStack.length - 1));
        setRedoStack([...redoStack, canvas.toDataURL()]);
        const img = new Image();
        img.src = lastAction;
        img.onload = () => {
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(img, 0, 0);
        };
      }
    }
  };

  const handleRedo = () => {
    if (canvasRef.current && redoStack.length > 0) {
      const lastRedoAction = redoStack[redoStack.length - 1];
      const canvas = canvasRef.current;
      const canvasContext = canvas?.getContext('2d');
      if (canvasContext) {
        setUndoStack([...undoStack, lastRedoAction]);
        setRedoStack(redoStack.slice(0, redoStack.length - 1));
        const img = new Image();
        img.src = lastRedoAction;
        img.onload = () => {
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(img, 0, 0);
        };
      }
    }
  };

  const saveCanvasState = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasData = canvas.toDataURL();
      setUndoStack([...undoStack, canvasData]);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          width: '200px',
          border: '1px solid black',
          padding: '10px',
        }}
      >
        {/* Tool box contents */}
        <input type="color" onChange={handleColorChange} />

        <select
          value={selectedThickness}
          onChange={handleThicknessChange}
          style={{ marginTop: '10px' }}
        >
          <option value={5}>5px</option>
          <option value={10}>10px</option>
          <option value={15}>15px</option>
          <option value={20}>20px</option>
          <option value={25}>25px</option>
        </select>

        <button
          onClick={handleClearCanvas}
          style={{ marginTop: '10px', width: '100%' }}
        >
          Clear
        </button>

        <button
          onClick={handleUndo}
          style={{ marginTop: '10px', width: '100%' }}
        >
          Undo
        </button>

        <button
          onClick={handleRedo}
          style={{ marginTop: '10px', width: '100%' }}
        >
          Redo
        </button>

      </div>
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: '1px solid black',
          marginLeft: '10px',
          position: 'relative',
        }}
      >
        {/* Canvas contents */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ cursor: 'crosshair' }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onClick={handleCanvasMouseClick}
        />
      </div>
    </div>
  );
};

export default Canvas;
