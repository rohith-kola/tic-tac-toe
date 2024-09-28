import { useState } from "react";

// Square component
function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>
}

// Function to check for a winner
export function checkWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// Board component
function Board({ game, squares, xIsNext, onPlay, status, onResetGame }) {

    // Handle square click
    function clicked(i) {
        const nextSquares = squares.slice();

        if (nextSquares[i] || checkWinner(squares)) return;

        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }

        onPlay(nextSquares);
    }

    return (
        <div className="main">
            <h1 className="text-center text-2xl">{game}</h1>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => clicked(0)} />
                <Square value={squares[1]} onSquareClick={() => clicked(1)} />
                <Square value={squares[2]} onSquareClick={() => clicked(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => clicked(3)} />
                <Square value={squares[4]} onSquareClick={() => clicked(4)} />
                <Square value={squares[5]} onSquareClick={() => clicked(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => clicked(6)} />
                <Square value={squares[7]} onSquareClick={() => clicked(7)} />
                <Square value={squares[8]} onSquareClick={() => clicked(8)} />
            </div>
            <div>
                <h1>{status}</h1>
            </div>
            <button className="start" onClick={onResetGame}>Reset Game</button>
        </div>
    );
}

// Game component
export default function Game({ name }) {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [status, setStatus] = useState("Next Player: X");

    // Handle play
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);

        const winner = checkWinner(nextSquares);
        if (winner) {
            setStatus("Winner: " + winner);
        } else {
            setStatus("Next Player: " + (xIsNext ? "O" : "X"));
        }
    }

    // Handle move jump
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        const winner = checkWinner(history[nextMove]);
        if (winner) {
            setStatus("Winner: " + winner);
        } else {
            setStatus("Next Player: " + (nextMove % 2 === 0 ? "X" : "O"));
        }
    }

    // Reset game
    function resetGame() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
        setStatus("Next Player: X");
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <>
            <div>
                <Board
                    game={name}
                    squares={currentSquares}
                    xIsNext={xIsNext}
                    onPlay={handlePlay}
                    status={status}
                    onResetGame={resetGame}
                />
            </div>
            <div className="text-center">
                <h1>History</h1>
                <ol>{moves}</ol>
            </div>
        </>
    );
}