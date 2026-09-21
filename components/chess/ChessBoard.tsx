"use client";

import { useState } from "react";

type Square = {
  piece?: string;
  color?: "white" | "black";
};

const initialBoard: Square[][] = [
  [
    { piece: "♜", color: "black" },
    { piece: "♞", color: "black" },
    { piece: "♝", color: "black" },
    { piece: "♛", color: "black" },
    { piece: "♚", color: "black" },
    { piece: "♝", color: "black" },
    { piece: "♞", color: "black" },
    { piece: "♜", color: "black" },
  ],
  Array(8).fill({ piece: "♟", color: "black" }),
  Array(8).fill({}),
  Array(8).fill({}),
  Array(8).fill({}),
  Array(8).fill({}),
  Array(8).fill({ piece: "♙", color: "white" }),
  [
    { piece: "♖", color: "white" },
    { piece: "♘", color: "white" },
    { piece: "♗", color: "white" },
    { piece: "♕", color: "white" },
    { piece: "♔", color: "white" },
    { piece: "♗", color: "white" },
    { piece: "♘", color: "white" },
    { piece: "♖", color: "white" },
  ],
];

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState("Select a white piece.");

  const handleSquareClick = (row: number, col: number) => {
    const square = board[row][col];

    if (!selected) {
      if (square.piece && square.color === "white") {
        setSelected([row, col]);
        setMessage("Choose where you want to move it.");
      }
      return;
    }

    const [fromRow, fromCol] = selected;

    if (fromRow === row && fromCol === col) {
      setSelected(null);
      setMessage("Select a white piece.");
      return;
    }

    const next = board.map((r) => r.map((s) => ({ ...s })));

    next[row][col] = {
      ...next[fromRow][fromCol],
    };

    next[fromRow][fromCol] = {};

    setBoard(next);
    setSelected(null);
    setMessage("Move made. Think about the next one.");
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setSelected(null);
    setMessage("Select a white piece.");
  };

  return (
    <section
      id="board"
      className="overflow-hidden bg-[#111] py-24 text-white lg:py-36"
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
            INTERACTIVE STUDY
          </p>

          <h2 className="mt-6 font-serif text-6xl leading-[0.86] tracking-[-0.055em] sm:text-7xl">
            Your move.
          </h2>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-white/65">
            Start with the white pieces. Select a piece, then choose
            a square. This is a simple interaction study — the full
            game belongs on the board, not inside a marketing page.
          </p>

          <div className="mt-8 flex items-center gap-5">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              {message}
            </span>

            <button
              onClick={resetBoard}
              className="border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.18em] transition hover:border-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[720px]">
          <div className="grid grid-cols-8 border border-white/20">
            {board.map((row, rowIndex) =>
              row.map((square, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const isSelected =
                  selected?.[0] === rowIndex &&
                  selected?.[1] === colIndex;

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() =>
                      handleSquareClick(rowIndex, colIndex)
                    }
                    className={`relative aspect-square flex items-center justify-center text-[clamp(2rem,7vw,4.8rem)] leading-none transition
                      ${
                        isDark
                          ? "bg-[#4b443a]"
                          : "bg-[#d8d2c7]"
                      }
                      ${
                        isSelected
                          ? "z-10 ring-4 ring-inset ring-[#a88752]"
                          : ""
                      }
                      hover:brightness-110
                    `}
                    aria-label={`Chess square ${rowIndex + 1}-${colIndex + 1}`}
                  >
                    {square.piece && (
                      <span
                        className={
                          square.color === "white"
                            ? "text-white [text-shadow:0_2px_3px_rgba(0,0,0,.6)]"
                            : "text-[#111]"
                        }
                      >
                        {square.piece}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-5 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/30">
            <span>SHoP</span>
            <span>EVERY MOVE COUNTS</span>
          </div>
        </div>
      </div>
    </section>
  );
}