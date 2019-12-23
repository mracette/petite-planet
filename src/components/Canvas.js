import React, { useRef } from 'react';

function Canvas() {

    const pixelRatio = typeof document !== 'undefined' ? window.devicePixelRatio : 1;

    const canvasRef = useRef(null);

    const setCanvasSize = () => {
        // resize to device pixel ratio
        canvasRef.current.clientWidth !== 0 && (canvasRef.current.width = pixelRatio * canvasRef.current.clientWidth);
    }

    window.addEventListener('resize', setCanvasSize);

    return (
        <canvas
            id='game-canvas'
            ref={canvasRef}
        />
    );

}

export default Canvas;