import React, { useEffect, useRef } from 'react';
import Annotorious from '@recogito/annotorious';

const ImageEditor = ({ imageUrl, onSave }) => {
  const imgRef = useRef(null);
  const annoRef = useRef(null);

  useEffect(() => {
    if (imgRef.current) {
      annoRef.current = new Annotorious({
        image: imgRef.current,
        widgets: ['COMMENT'],
      });

      // Save annotations
      annoRef.current.on('createAnnotation', (annotation) => {
        console.log('Created annotation:', annotation);
      });

      annoRef.current.on('updateAnnotation', (annotation, previous) => {
        console.log('Updated annotation:', annotation, previous);
      });
    }

    return () => {
      if (annoRef.current) {
        annoRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <img ref={imgRef} src={imageUrl} alt="Annotatable" style={{ maxWidth: '100%' }} />
      <button onClick={() => onSave(annoRef.current.getAnnotations())}>Save Annotations</button>
    </div>
  );
};

export default ImageEditor;
