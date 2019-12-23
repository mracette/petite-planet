import React, { useRef, useEffect } from 'react';
import SceneManager from '../game/SceneManager';

function App() {

  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef) {
      const manager = new SceneManager(canvasRef.current);
      manager.init().then(() => {
        window.addEventListener('resize', manager.onWindowResize);
        manager.animate()
      });
    }
  }, [canvasRef]);

  return (
    <canvas
      id='game-canvas'
      className='fullscreen'
      ref={canvasRef}
    />
  )
}

export default App;
