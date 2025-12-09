import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SumGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Game State
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);
    const [bgmEnabled, setBgmEnabled] = useState(true);
    const [volume, setVolume] = useState(50);

    // Refs for mutable game state (to avoid re-renders in game loop)
    const gameState = useRef({
        apples: [] as any[],
        input: { isDragging: false, startX: 0, startY: 0, currX: 0, currY: 0 },
        feedbackBox: null as any,
        lastFrameTime: 0,
        cellSize: 30,
        timerInterval: null as any,
        GRID_COLS: 17,
        GRID_ROWS: 10,
        GAME_DURATION: 120
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const state = gameState.current;

        // --- Game Logic Functions ---

        const spawnAppleAt = (r: number, c: number) => {
            const val = Math.floor(Math.random() * 9) + 1;
            const existingIndex = state.apples.findIndex(a => a.r === r && a.c === c);
            
            const apple = {
                r, c, val,
                scale: 0,
                removed: false
            };

            if (existingIndex !== -1) {
                state.apples[existingIndex] = apple;
            } else {
                state.apples.push(apple);
            }
        };

        const resetGame = () => {
            setScore(0);
            setTimeLeft(state.GAME_DURATION);
            setIsGameOver(false);
            state.apples = [];
            state.feedbackBox = null;

            // Populate Grid
            for (let r = 0; r < state.GRID_ROWS; r++) {
                for (let c = 0; c < state.GRID_COLS; c++) {
                    spawnAppleAt(r, c);
                }
            }

            // Start Timer
            if (state.timerInterval) clearInterval(state.timerInterval);
            state.timerInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(state.timerInterval);
                        setIsGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        };

        const getNormalizedRect = (x1: number, y1: number, x2: number, y2: number) => ({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            w: Math.abs(x2 - x1),
            h: Math.abs(y2 - y1)
        });

        const getSelectedApples = (rect: any) => {
            return state.apples.filter(a => {
                if (a.removed) return false;
                const cellX = a.c * state.cellSize;
                const cellY = a.r * state.cellSize;
                return (
                    rect.x < cellX + state.cellSize &&
                    rect.x + rect.w > cellX &&
                    rect.y < cellY + state.cellSize &&
                    rect.y + rect.h > cellY
                );
            });
        };

        // --- Input Handling ---

        const getPointerPos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const handleInputStart = (e: any) => {
            if (!isGameStarted) return;
            if (isGameOver) return;

            e.preventDefault();
            const pos = getPointerPos(e);
            state.input.isDragging = true;
            state.input.startX = pos.x;
            state.input.startY = pos.y;
            state.input.currX = pos.x;
            state.input.currY = pos.y;
        };

        const handleInputMove = (e: any) => {
            if (!state.input.isDragging) return;
            if (e.touches) e.preventDefault();
            
            const pos = getPointerPos(e);
            state.input.currX = pos.x;
            state.input.currY = pos.y;
        };

        const handleInputEnd = () => {
            if (!state.input.isDragging) return;
            state.input.isDragging = false;

            const rect = getNormalizedRect(state.input.startX, state.input.startY, state.input.currX, state.input.currY);
            
            if (rect.w < 2 && rect.h < 2) return;

            const selectedApples = getSelectedApples(rect);
            const sum = selectedApples.reduce((s, a) => s + a.val, 0);

            if (sum === 10) {
                setScore(prev => prev + selectedApples.length);
                state.feedbackBox = { ...rect, color: '#00e676', timestamp: performance.now() };
                
                selectedApples.forEach(a => {
                    const idx = state.apples.findIndex(x => x.r === a.r && x.c === a.c);
                    if (idx !== -1) state.apples[idx].removed = true;
                });
            } else {
                state.feedbackBox = { ...rect, color: '#ff3d00', timestamp: performance.now() };
            }
        };

        // --- Rendering ---

        const draw = (timestamp: number) => {
            if (!canvas || !ctx) return;

            // Update
            state.apples.forEach(a => {
                if (a.scale < 1) {
                    a.scale += 0.1;
                    if (a.scale > 1) a.scale = 1;
                }
            });

            if (state.feedbackBox && timestamp - state.feedbackBox.timestamp > 300) {
                state.feedbackBox = null;
            }

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Apples
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `bold ${state.cellSize * 0.6}px Arial`;

            state.apples.forEach(a => {
                if (a.removed) return;
                const centerX = (a.c * state.cellSize) + (state.cellSize / 2);
                const centerY = (a.r * state.cellSize) + (state.cellSize / 2);
                const radius = (state.cellSize * 0.4) * a.scale;

                ctx.fillStyle = isLightMode ? '#ffadad' : '#e74c3c';
                ctx.beginPath();
                ctx.arc(centerX, centerY + radius*0.1, radius, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#8d6e63';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY - radius, radius * 0.3, Math.PI*0.7, Math.PI*1.3);
                ctx.stroke();

                ctx.fillStyle = '#fff';
                ctx.fillText(a.val.toString(), centerX, centerY + radius*0.1);
            });

            // Selection Box
            if (state.input.isDragging && !isGameOver) {
                const rect = getNormalizedRect(state.input.startX, state.input.startY, state.input.currX, state.input.currY);
                ctx.fillStyle = 'rgba(0, 200, 83, 0.3)';
                ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
                ctx.strokeStyle = '#00c853';
                ctx.lineWidth = 2;
                ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
            }

            // Feedback
            if (state.feedbackBox) {
                ctx.strokeStyle = state.feedbackBox.color;
                ctx.lineWidth = 5;
                ctx.strokeRect(state.feedbackBox.x, state.feedbackBox.y, state.feedbackBox.w, state.feedbackBox.h);
            }
        };

        // --- Loop & Resize ---

        let animationFrameId: number;

        const loop = (timestamp: number) => {
            draw(timestamp);
            animationFrameId = requestAnimationFrame(loop);
        };

        const resizeCanvas = () => {
            if (!containerRef.current || !canvas) return;
            
            const maxW = window.innerWidth * 0.9;
            const maxH = window.innerHeight * 0.75;
            
            const maxCellWidth = maxW / state.GRID_COLS;
            const maxCellHeight = maxH / state.GRID_ROWS;
            
            state.cellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));
            
            const finalW = state.cellSize * state.GRID_COLS;
            const finalH = state.cellSize * state.GRID_ROWS;
            
            canvas.width = finalW;
            canvas.height = finalH;
            
            if (containerRef.current) {
                containerRef.current.style.width = `${finalW}px`;
                containerRef.current.style.height = `${finalH}px`;
                containerRef.current.style.backgroundSize = `${state.cellSize}px ${state.cellSize}px`;
            }
        };

        // Listeners
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousedown', handleInputStart);
        window.addEventListener('mousemove', handleInputMove);
        window.addEventListener('mouseup', handleInputEnd);
        canvas.addEventListener('touchstart', handleInputStart, { passive: false });
        window.addEventListener('touchmove', handleInputMove, { passive: false });
        window.addEventListener('touchend', handleInputEnd);

        resizeCanvas();
        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousedown', handleInputStart);
            window.removeEventListener('mousemove', handleInputMove);
            window.removeEventListener('mouseup', handleInputEnd);
            canvas.removeEventListener('touchstart', handleInputStart);
            window.removeEventListener('touchmove', handleInputMove);
            window.removeEventListener('touchend', handleInputEnd);
            cancelAnimationFrame(animationFrameId);
            if (state.timerInterval) clearInterval(state.timerInterval);
        };
    }, [isGameStarted, isGameOver, isLightMode]); // Re-bind when game state changes

    // Start Game Handler
    const handleStartGame = () => {
        setIsGameStarted(true);
        gameState.current.apples = []; // Clear any existing
        
        // Need to trigger the reset logic inside the effect or call it here
        // Since resetGame is inside useEffect, we can't call it directly.
        // But setting isGameStarted(true) triggers the effect.
        // We need a way to initialize the grid.
        
        // Let's move initialization logic to a separate effect or ref
        // Actually, simpler: just manually init grid here for now, or rely on effect
        
        // Better: The effect depends on isGameStarted. 
        // When isGameStarted becomes true, we should init the game.
    };

    // Effect to handle game start/reset
    useEffect(() => {
        if (isGameStarted && !isGameOver) {
            // Initialize grid
            const state = gameState.current;
            state.apples = [];
            for (let r = 0; r < state.GRID_ROWS; r++) {
                for (let c = 0; c < state.GRID_COLS; c++) {
                    const val = Math.floor(Math.random() * 9) + 1;
                    state.apples.push({ r, c, val, scale: 0, removed: false });
                }
            }
            
            // Start timer
            if (state.timerInterval) clearInterval(state.timerInterval);
            state.timerInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(state.timerInterval);
                        setIsGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [isGameStarted]);

    const handleReset = () => {
        setIsGameStarted(false);
        setIsGameOver(false);
        setScore(0);
        setTimeLeft(120);
        if (gameState.current.timerInterval) clearInterval(gameState.current.timerInterval);
    };

    return (
        <div style={{
            margin: 0,
            padding: 0,
            backgroundColor: '#00c853',
            color: '#fff',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw'
        }}>
            <div id="main-frame" style={{
                backgroundColor: '#f0f0f0',
                border: '10px solid #00e676',
                borderRadius: '15px',
                padding: '5px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    color: '#0a6b34',
                    fontWeight: 800
                }}>
                    <div className="pill" style={{
                        background: '#dff6e9',
                        border: '2px solid #2cc56a',
                        borderRadius: '999px',
                        padding: '6px 12px',
                        color: '#0a6b34'
                    }}>Sum Fruit</div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="pill" style={{
                            background: '#dff6e9',
                            border: '2px solid #2cc56a',
                            borderRadius: '999px',
                            padding: '6px 12px',
                            color: '#0a6b34'
                        }}>Score: {score}</div>
                        <div className="pill" style={{
                            background: '#dff6e9',
                            border: '2px solid #2cc56a',
                            borderRadius: '999px',
                            padding: '6px 12px',
                            color: '#0a6b34'
                        }}>Time: {timeLeft}s</div>
                        <Link to="/dashboard" className="pill" style={{
                            textDecoration: 'none',
                            background: '#dff6e9',
                            border: '2px solid #2cc56a',
                            borderRadius: '999px',
                            padding: '6px 12px',
                            color: '#0a6b34'
                        }}>Back</Link>
                    </div>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div ref={containerRef} style={{
                        position: 'relative',
                        backgroundImage: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)',
                        backgroundColor: '#fff'
                    }}>
                        <canvas ref={canvasRef} style={{ cursor: 'crosshair', touchAction: 'none', display: 'block' }} />
                        
                        {/* Start Overlay */}
                        {!isGameStarted && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
                                justifyContent: 'center', alignItems: 'center', color: '#fff'
                            }}>
                                <h1 style={{ fontSize: '40px', marginBottom: '20px' }}>Sum Fruit</h1>
                                <div style={{ textAlign: 'center', marginBottom: '30px', lineHeight: '1.6' }}>
                                    <p>Drag to select apples. If sum == 10, they pop!</p>
                                    <p>Score points and clear the board.</p>
                                </div>
                                <button onClick={handleStartGame} style={{
                                    backgroundColor: '#27ae60', color: '#fff', border: 'none',
                                    padding: '15px 40px', fontSize: '24px', fontWeight: 'bold',
                                    cursor: 'pointer', borderRadius: '5px'
                                }}>Start Game</button>
                            </div>
                        )}

                        {/* Game Over Overlay */}
                        {isGameOver && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
                                justifyContent: 'center', alignItems: 'center', color: '#fff'
                            }}>
                                <h1 style={{ fontSize: '40px', marginBottom: '10px' }}>Time's Up!</h1>
                                <h2 style={{ fontSize: '30px', marginBottom: '30px' }}>Final Score: {score}</h2>
                                <button onClick={handleReset} style={{
                                    backgroundColor: '#27ae60', color: '#fff', border: '2px solid #1b8f4d',
                                    padding: '10px 30px', fontSize: '24px', fontWeight: 'bold',
                                    cursor: 'pointer', borderRadius: '5px'
                                }}>Play Again</button>
                            </div>
                        )}
                    </div>

                    {/* Timer Bar */}
                    <div style={{
                        width: '15px', height: '100%', backgroundColor: '#ccc',
                        borderRadius: '8px', overflow: 'hidden', display: 'flex',
                        justifyContent: 'center', alignItems: 'flex-end', padding: '2px',
                        boxSizing: 'border-box'
                    }}>
                        <div style={{
                            width: '100%',
                            height: `${(timeLeft / 120) * 100}%`,
                            backgroundColor: '#00c853',
                            borderRadius: '6px',
                            transition: 'height 0.1s linear'
                        }} />
                    </div>
                </div>

                {/* Controls */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px', backgroundColor: '#00c853', color: '#fff',
                    borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'
                }}>
                    <button onClick={handleReset} style={{
                        backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid #fff',
                        padding: '5px 15px', borderRadius: '5px', cursor: 'pointer',
                        fontWeight: 'bold', color: '#fff'
                    }}>Reset</button>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" checked={isLightMode} onChange={e => setIsLightMode(e.target.checked)} style={{ marginRight: '5px' }} />
                            Light Colors
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" checked={bgmEnabled} onChange={e => setBgmEnabled(e.target.checked)} style={{ marginRight: '5px' }} />
                            BGM
                        </label>
                        <span>🎵</span>
                        <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: '60px', cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
