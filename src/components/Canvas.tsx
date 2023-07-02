import React, { useState } from 'react';

interface CanvasProps {
  canvasWidth: number;
  canvasHeight: number;
}

const Canvas: React.FC<CanvasProps> = ({ canvasWidth, canvasHeight }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedThickness, setSelectedThickness] = useState(15);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const canvas = event.currentTarget.querySelector(
      'canvas'
    ) as HTMLCanvasElement | null;
    if (canvas) {
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
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleThicknessChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedThickness(Number(event.target.value));
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
      </div>
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: '1px solid black',
          marginLeft: '10px',
          position: 'relative',
        }}
        onClick={handleCanvasClick}
      >
        {/* Canvas contents */}
        <canvas
          width={canvasWidth}
          height={canvasHeight}
          style={{ cursor: 'crosshair' }}
        />
      </div>
    </div>
  );
};

export default Canvas;
