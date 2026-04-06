
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface FocusGameProps {
    onGameEnd: () => void;
}

const BINGO_SIZE = 5;

const FocusGame: React.FC<FocusGameProps> = ({ onGameEnd }) => {
    const [board, setBoard] = useState<{ value: number; marked: boolean }[][]>([]);
    const [bingoCount, setBingoCount] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    // Initialize randomized 5x5 Bingo board
    const initBoard = useCallback(() => {
        const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        const shuffled = numbers.sort(() => Math.random() - 0.5);
        
        const newBoard: { value: number; marked: boolean }[][] = [];
        for (let i = 0; i < BINGO_SIZE; i++) {
            const row = [];
            for (let j = 0; j < BINGO_SIZE; j++) {
                // Middle spot is FREE in traditional bingo
                if (i === 2 && j === 2) {
                    row.push({ value: 0, marked: true });
                } else {
                    row.push({ value: shuffled.pop()!, marked: false });
                }
            }
            newBoard.push(row);
        }
        setBoard(newBoard);
        setBingoCount(0);
        setGameWon(false);
    }, []);

    useEffect(() => {
        initBoard();
    }, [initBoard]);

    const checkBingo = (currentBoard: { value: number; marked: boolean }[][]) => {
        let lines = 0;

        // Rows
        for (let i = 0; i < BINGO_SIZE; i++) {
            if (currentBoard[i].every(cell => cell.marked)) lines++;
        }

        // Columns
        for (let j = 0; j < BINGO_SIZE; j++) {
            let colFilled = true;
            for (let i = 0; i < BINGO_SIZE; i++) {
                if (!currentBoard[i][j].marked) {
                    colFilled = false;
                    break;
                }
            }
            if (colFilled) lines++;
        }

        // Main Diagonal
        let diag1Filled = true;
        for (let i = 0; i < BINGO_SIZE; i++) {
            if (!currentBoard[i][i].marked) {
                diag1Filled = false;
                break;
            }
        }
        if (diag1Filled) lines++;

        // Anti Diagonal
        let diag2Filled = true;
        for (let i = 0; i < BINGO_SIZE; i++) {
            if (!currentBoard[i][BINGO_SIZE - 1 - i].marked) {
                diag2Filled = false;
                break;
            }
        }
        if (diag2Filled) lines++;

        setBingoCount(lines);
        if (lines >= 1 && !gameWon) {
            setGameWon(true);
        }
    };

    const handleCellClick = (r: number, c: number) => {
        if (board[r][c].value === 0) return; // Ignore free cell click

        const newBoard = board.map((row, ri) => 
            row.map((cell, ci) => {
                if (ri === r && ci === c) {
                    return { ...cell, marked: !cell.marked };
                }
                return cell;
            })
        );
        setBoard(newBoard);
        checkBingo(newBoard);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4 select-none overflow-hidden animate-reveal">
            <div className="text-center mb-6">
                <h2 className="text-5xl font-black text-brand mb-1 tracking-tighter uppercase italic">Bingo Brain</h2>
                <p className="text-text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Neural Pattern Recognition</p>
            </div>

            <div className="mb-6 flex gap-8">
                <div className="text-center">
                    <p className="text-[10px] font-black text-text-secondary uppercase mb-1">Detected Lines</p>
                    <p className={`text-4xl font-black italic ${bingoCount > 0 ? 'text-brand animate-pulse' : 'text-white/20'}`}>{bingoCount}</p>
                </div>
                {gameWon && (
                     <div className="text-center animate-bounce">
                        <p className="text-[10px] font-black text-green-400 uppercase mb-1">Status</p>
                        <p className="text-4xl font-black italic text-green-400">BINGO!</p>
                    </div>
                )}
            </div>

            <Card className="p-3 bg-secondary/50 border-brand/20 shadow-[0_0_50px_rgba(56,189,248,0.1)] mb-8">
                <div 
                    className="grid gap-2" 
                    style={{ 
                        gridTemplateColumns: `repeat(${BINGO_SIZE}, minmax(0, 1fr))`,
                        width: 'min(90vw, 420px)',
                        aspectRatio: '1/1'
                    }}
                >
                    {board.map((row, r) => (
                        row.map((cell, c) => (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => handleCellClick(r, c)}
                                className={`flex items-center justify-center text-sm sm:text-lg font-black rounded-xl transition-all duration-300 transform ${
                                    cell.marked 
                                    ? 'bg-brand text-primary shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-95 border-brand' 
                                    : 'bg-white/5 text-text-secondary border border-white/5 hover:border-brand/40 hover:bg-white/10 active:scale-105'
                                }`}
                            >
                                {cell.value === 0 ? 'FREE' : cell.value}
                            </button>
                        ))
                    ))}
                </div>
            </Card>

            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <Button onClick={initBoard} variant="secondary" className="px-10 py-3 text-[10px] font-black uppercase tracking-widest border border-white/10">Scramble Deck</Button>
                    <Button onClick={onGameEnd} className="px-10 py-3 text-[10px] font-black uppercase tracking-widest">Exit Training</Button>
                </div>
            </div>
        </div>
    );
};

export default FocusGame;
