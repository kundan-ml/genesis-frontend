import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const AnnotationPage = ({ imageUrl, closeModal }) => {
  const [annotations, setAnnotations] = useState([]);
  const [annotationInput, setAnnotationInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleInputChange = (e) => {
    setAnnotationInput(e.target.value);
  };

  const addAnnotation = () => {
    const newAnnotation = {
      text: annotationInput,
      x: position.x,
      y: position.y,
    };
    setAnnotations([...annotations, newAnnotation]);
    setAnnotationInput('');
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      setPosition({
        x: position.x + event.movementX,
        y: position.y + event.movementY,
      });
    }
  };

  const renderAnnotations = () => {
    return annotations.map((annotation, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: annotation.x,
          top: annotation.y,
          backgroundColor: 'rgba(255, 255, 0, 0.8)',
          padding: '5px',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      >
        {annotation.text}
      </div>
    ));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        addAnnotation();
      } else if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [annotationInput]);

  return (
    <div>
      <button onClick={closeModal} style={{ marginBottom: '10px' }}>Close</button>
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent>
              <img
                src={imageUrl}
                alt="Annotated image"
                onMouseMove={handleMouseMove}
                style={{
                  width: '100%',
                  cursor: 'grab',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </TransformComponent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button onClick={zoomIn} style={{ marginRight: '10px' }}>Zoom In</button>
              <button onClick={zoomOut} style={{ marginRight: '10px' }}>Zoom Out</button>
              <button onClick={resetTransform}>Reset</button>
            </div>
          </>
        )}
      </TransformWrapper>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={annotationInput}
          onChange={handleInputChange}
          placeholder="Add annotation..."
          style={{ width: '80%', padding: '5px' }}
        />
        <button onClick={addAnnotation} style={{ marginLeft: '10px' }}>Add Annotation</button>
      </div>
      <div style={{ position: 'relative', marginTop: '20px', height: '100vh' }}>
        {renderAnnotations()}
      </div>
    </div>
  );
};
