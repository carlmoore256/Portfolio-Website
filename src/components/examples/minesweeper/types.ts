
export type FlagState = "" | "flag" | "question";
export type WinState = "" | "win" | "lose";

// this is the data we store for each minesweeper cell
export interface CellData {
    isMine: boolean;
    isRevealed: boolean;
    adjacentMineCount: number;
    flagState: FlagState;
}

// note: grid data is stored as an array of rows (indexed with row column coords instead of x y)
// I chose this over an array of columns because I knew I would be rendering the grid row by row
export type GridData = CellData[][];

export interface Vec2 {
    x: number;
    y: number;
}

export interface Size2 {
    width: number;
    height: number;
}

/** a Difficulty combines a BoardSize and mine count, and gives it a name */
export interface Difficulty extends Size2 {
    name: string;
    mineCount: number;
}