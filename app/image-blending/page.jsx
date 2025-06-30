'use client'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function ImageBlendingApp() {
  const [rawImage, setRawImage] = useState(null);
  const [photoImage, setPhotoImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    maskBlur: 5,
    denoising: 0.5,
    resizeMode: 'Just Resize',
    inpaintArea: 'Only Masked',
  });
  
  const rawCanvasRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const [rawCoords, setRawCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [photoCoords, setPhotoCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState(null);

  const BACKEND_URL = process.env.BACKEND_URL
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (type === 'raw') {
          setRawImage(img);
          drawImageToCanvas(img, rawCanvasRef.current);
        } else {
          setPhotoImage(img);
          drawImageToCanvas(img, photoCanvasRef.current);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawImageToCanvas = (img, canvas) => {
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e, canvasType) => {
    setIsDrawing(true);
    setCurrentCanvas(canvasType);
    
    const canvas = canvasType === 'raw' ? rawCanvasRef.current : photoCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (canvasType === 'raw') {
      setRawCoords({ x1: x, y1: y, x2: x, y2: y });
    } else {
      setPhotoCoords({ x1: x, y1: y, x2: x, y2: y });
    }
  };

  const drawRectangle = (e) => {
    if (!isDrawing || !currentCanvas) return;
    
    const canvas = currentCanvas === 'raw' ? rawCanvasRef.current : photoCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentCanvas === 'raw') {
      setRawCoords(prev => ({ ...prev, x2: x, y2: y }));
    } else {
      setPhotoCoords(prev => ({ ...prev, x2: x, y2: y }));
    }
    
    // Redraw canvas with rectangle
    redrawCanvasWithRectangle();
  };

  const redrawCanvasWithRectangle = () => {
    if (currentCanvas === 'raw' && rawImage) {
      const canvas = rawCanvasRef.current;
      const ctx = canvas.getContext('2d');
      drawImageToCanvas(rawImage, canvas);
      
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        rawCoords.x1, rawCoords.y1, 
        rawCoords.x2 - rawCoords.x1, 
        rawCoords.y2 - rawCoords.y1
      );
    } else if (currentCanvas === 'photo' && photoImage) {
      const canvas = photoCanvasRef.current;
      const ctx = canvas.getContext('2d');
      drawImageToCanvas(photoImage, canvas);
      
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        photoCoords.x1, photoCoords.y1, 
        photoCoords.x2 - photoCoords.x1, 
        photoCoords.y2 - photoCoords.y1
      );
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const processImages = async () => {
    if (!rawImage || !photoImage) {
      alert('Please upload both images first');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create FormData to submit to Django
      const formData = new FormData();
      
      // Convert canvas images to Blob and append to formData
      const rawBlob = await canvasToBlob(rawCanvasRef.current);
      const photoBlob = await canvasToBlob(photoCanvasRef.current);
      
      formData.append('raw_image', rawBlob, 'raw.png');
      formData.append('photo_image', photoBlob, 'photo.png');
      
      // Add coordinates
      formData.append('mask_x1', rawCoords.x1);
      formData.append('mask_y1', rawCoords.y1);
      formData.append('mask_x2', rawCoords.x2);
      formData.append('mask_y2', rawCoords.y2);
      
      formData.append('photo_x1', photoCoords.x1);
      formData.append('photo_y1', photoCoords.y1);
      formData.append('photo_x2', photoCoords.x2);
      formData.append('photo_y2', photoCoords.y2);
      
      // Add settings
      formData.append('mask_blur', settings.maskBlur);
      formData.append('denoising', settings.denoising);
      formData.append('resize_mode', settings.resizeMode);
      formData.append('inpaint_area', settings.inpaintArea);
      
      // Submit to Django
      const response = await fetch(`${BACKEND_URL}/process/`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setResultImage(data.result_url);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const canvasToBlob = (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  return (
    <div className="container">
      <Head>
        <title>Image Blending App</title>
      </Head>
      
      <h1>Image Blending Application</h1>
      
      <div className="image-grid">
        <div className="image-section">
          <h2>Raw Image</h2>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleImageUpload(e, 'raw')} 
          />
          <canvas
            ref={rawCanvasRef}
            onMouseDown={(e) => startDrawing(e, 'raw')}
            onMouseMove={drawRectangle}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ border: '1px solid #000', maxWidth: '100%' }}
          />
        </div>
        
        <div className="image-section">
          <h2>Photo</h2>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleImageUpload(e, 'photo')} 
          />
          <canvas
            ref={photoCanvasRef}
            onMouseDown={(e) => startDrawing(e, 'photo')}
            onMouseMove={drawRectangle}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ border: '1px solid #000', maxWidth: '100%' }}
          />
        </div>
      </div>
      
      <div className="controls">
        <h2>Settings</h2>
        
        <div className="setting">
          <label>Mask Blur: {settings.maskBlur}</label>
          <input
            type="range"
            min="0"
            max="20"
            value={settings.maskBlur}
            onChange={(e) => setSettings({...settings, maskBlur: parseInt(e.target.value)})}
          />
        </div>
        
        <div className="setting">
          <label>Denoising Strength: {settings.denoising}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.denoising * 100}
            onChange={(e) => setSettings({...settings, denoising: parseInt(e.target.value) / 100})}
          />
        </div>
        
        <div className="setting">
          <label>Resize Mode:</label>
          <select
            value={settings.resizeMode}
            onChange={(e) => setSettings({...settings, resizeMode: e.target.value})}
          >
            <option value="Just Resize">Just Resize</option>
            <option value="Crop and Resize">Crop and Resize</option>
            <option value="Resize and Fill">Resize and Fill</option>
          </select>
        </div>
        
        <div className="setting">
          <label>Inpaint Area:</label>
          <select
            value={settings.inpaintArea}
            onChange={(e) => setSettings({...settings, inpaintArea: e.target.value})}
          >
            <option value="Only Masked">Only Masked</option>
            <option value="Full Image">Full Image</option>
          </select>
        </div>
        
        <button 
          onClick={processImages} 
          disabled={isProcessing || !rawImage || !photoImage}
        >
          {isProcessing ? 'Processing...' : 'Process Images'}
        </button>
      </div>
      
      {resultImage && (
        <div className="result-section">
          <h2>Result</h2>
          <img src={resultImage} alt="Result" style={{ maxWidth: '100%' }} />
          <a href={`${BACKEND_URL}${resultImage}`} download="blended_result.png">
            <button>Download Result</button>
          </a>
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .image-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .image-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .controls {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .setting {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
        }
        
        input[type="range"] {
          width: 100%;
        }
        
        button {
          padding: 10px 20px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .result-section {
          text-align: center;
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
}