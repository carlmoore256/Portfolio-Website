/*
This file contains minesweeper related logic which has nothing to do with React / rendering.
 */

import { CellData, Difficulty, GridData, Size2, Vec2 } from "./types";

// CONSTANTS

export const DIFFICULTY_PRESETS: Difficulty[] = [
    {
        name: "easy",
        width: 10,
        height: 10,
        mineCount: 10
    },
    {
        name: "medium",
        width: 16,
        height: 16,
        mineCount: 40
    },
    {
        name: "expert",
        width: 30,
        height: 16,
        mineCount: 100
    }
];

export const DEFAULT_DIFFICULTY_PRESET = DIFFICULTY_PRESETS[0]; // easy

// values which cells an empty cell should be initialized to
export const DEFAULT_CELL_DATA: CellData = {
    isMine: false,
    isRevealed: false,
    adjacentMineCount: -1,
    flagState: ""
};

// HELPERS

export function copyGrid(grid: GridData) {
    return grid.map(row => row.map(cell => ({...cell})));
}

export function cellAtXY(grid: GridData, x: number, y: number): CellData {
    return grid[y][x];
}

export function getAdjacentPositions(pos: Vec2, gridSize: Size2): Vec2[] {
    const {x, y} = pos;
    const positions: Vec2[] = [];
    for (let xOff = -1; xOff <= 1; xOff++) {
        for (let yOff = -1; yOff <= 1; yOff++) {
            if (xOff === 0 && yOff === 0)
                continue;
            const p: Vec2 = {x: x + xOff, y: y + yOff};
            if (p.x < 0 || p.y < 0 || p.x >= gridSize.width || p.y >= gridSize.height)
                continue;
            positions.push(p);
        }
    }
    return positions;
}

/** reveals cell(s) starting at pos (mutates the grid data!) */
export function reveal(grid: GridData, pos: Vec2) {
    const {x, y} = pos;
    const cell = cellAtXY(grid, x, y);
    if (cell.isRevealed) {
        // already revealed...
        return;
    }
    if (cell.flagState !== "") {
        // can't reveal a flagged cell...
        return;
    }
    cell.isRevealed = true;
    if (cell.isMine) {
        // yikes...
        return;
    }
    // it's not a mine so we need to...
    // - count up adjacent mines
    // - reveal adjacent cells IFF adjacent mine count equals zero
    const gridSize: Size2 = {width: grid[0].length, height: grid.length};
    const adjacentPositions = getAdjacentPositions(pos, gridSize);
    const adjacentCells = adjacentPositions.map(p => cellAtXY(grid, p.x, p.y));
    cell.adjacentMineCount = adjacentCells.reduce((p, c) => p + (c.isMine ? 1 : 0), 0);
    if (cell.adjacentMineCount === 0) {
        adjacentPositions.forEach(p => reveal(grid, p));
    }
}

// returns the change in flag count
export function cycleFlagState(grid: GridData, pos: Vec2): number {
    const cellData = cellAtXY(grid, pos.x, pos.y);
    if (cellData.isRevealed) {
        // can't flag a revealed cell...
        return 0;
    }
    if (cellData.flagState === "") {
        cellData.flagState = "flag";
        return 1;
    } else if (cellData.flagState === "flag") {
        cellData.flagState = "question";
        return -1;
    }
    cellData.flagState = "";
    return 0;
}

/**
 * The player wins if all cells have been revealed except for the mines
 */
export function checkWin(gridData: GridData): boolean {
    const w = gridData[0].length;
    const h = gridData.length;
    for(let r = 0; r < h; r++){
        for (let c = 0; c < w; c++) {
            const cellData = gridData[r][c];
            if (!cellData.isRevealed && !cellData.isMine) return false;
        }
    }
    return true;
}

/**
 * notes:
 * - assumes gridData is mine-free to start with
 * - mutates gridData
 */
export function placeMines(gridData: GridData, howMany: number, safeSpot: Vec2): void {
    const w = gridData[0].length;
    const h = gridData.length;
    if (w * h < howMany - 1) {
        // impossible to place all mines...
        throw new Error("can't place that many mines...");
    }
    // make a copy of cellData
    let remaining = howMany;
    while (remaining > 0) {
        const x = Math.floor(Math.random() * w);
        const y = Math.floor(Math.random() * h);
        if (safeSpot.x === x && safeSpot.y === y) continue;
        const cell = cellAtXY(gridData, x, y);
        if (!cell.isMine) {
            cell.isMine = true;
            remaining--;
        }
    }
}