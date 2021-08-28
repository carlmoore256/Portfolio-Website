import { useCallback, useEffect, useState } from "react";
import { range } from "../../../model/functional";
import {
    cellAtXY, checkWin,
    copyGrid,
    cycleFlagState,
    DEFAULT_CELL_DATA,
    DEFAULT_DIFFICULTY_PRESET, DIFFICULTY_PRESETS, placeMines,
    reveal
} from "./model";
import { GridData, Vec2, WinState } from "./types";
import { Cell } from "./Cell";

/**
 * Who doesn't love minesweeper?
 * This is a good example of a 2D game that can be rendered without knowing a thing about 2D graphics -
 * we can represent the game with basic DOM elements.
 * @constructor
 */
export function Minesweeper() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY_PRESET);
    const [gridData, setGridData] = useState<GridData>([]);
    // whether the mines have been placed yet (if false, the first click has not been made)
    const [minesPlaced, setMinesPlaced] = useState(false);
    const [flagCount, setFlagCount] = useState(0);
    const [winState, setWinState] = useState<WinState>("");

    const initGrid = useCallback(() => {
        const {width, height} = difficulty;
        const newGridData: GridData = range(height).map(_ =>
            range(width).map(_ => ({...DEFAULT_CELL_DATA}))
        );
        setGridData(newGridData);
        setWinState("");
        setFlagCount(0);
        setMinesPlaced(false);
    }, [difficulty]);

    useEffect(() => {
        initGrid();
    }, [initGrid]);

    const onReveal = useCallback((pos: Vec2) => {
        if (winState !== ""){
            // can't do anything in this state
            return;
        }
        setGridData(prev => {
            const copy = copyGrid(prev);
            if (!minesPlaced) {
                placeMines(copy, difficulty.mineCount, pos);
                setMinesPlaced(true);
            }
            reveal(copy, pos);
            return copy;
        });
        const cell = cellAtXY(gridData, pos.x, pos.y);
        if (cell.isMine) {
            setWinState("lose");
        }
    }, [gridData, minesPlaced, placeMines, winState]);

    useEffect(() => {
        if (!minesPlaced) return;
        if (checkWin(gridData)) {
            setWinState("win");
        }
    }, [gridData, minesPlaced]);

    // cycle flag state
    const onFlag = useCallback((pos: Vec2) => {
        if (winState !== ""){
            // can't do anything in this state
            return;
        }
        let deltaFlags = 0; // change in number of flags
        setGridData(prev => {
            const copy = copyGrid(prev);
            deltaFlags = cycleFlagState(copy, pos);
            return copy;
        });
        setFlagCount(p => p + deltaFlags);
    }, [winState]);

    const minesLeft = difficulty.mineCount - flagCount;

    let winStateMessage = "";
    if (winState === "win") {
        winStateMessage = "YOU WIN!";
    }
    else if (winState === "lose") {
        winStateMessage = "YOU LOSE!";
    }

    return <>
        {/* difficulty chooser (arguably I'm abusing the select element here...) */}
        <select value=""
            onChange={event => setDifficulty(DIFFICULTY_PRESETS[parseInt(event.target.value)])}
        >
            <option value="">- new game -</option>
            {
                DIFFICULTY_PRESETS.map((p,i) => <option
                    key={i}
                    value={i}>
                    {DIFFICULTY_PRESETS[i].name}
                </option>)
            }
        </select>

        {/* info about game / buttons */}
        <div>
            Mines left: {minesLeft}
        </div>
        {
            winStateMessage === "" ?
                <></> :
                <div>{winStateMessage} <button onClick={initGrid}>New Game</button></div>
        }
        {/* the minefield */}
        <div>
            <table>
                <tbody>
                {
                    gridData.map((row, r) => <tr key={r}>
                        {
                            row.map((cell, c) => <td key={c}>
                                <Cell
                                    data={cell}
                                    onReveal={() => onReveal({x: c, y: r})}
                                    onFlag={() => onFlag({x: c, y: r})}
                                />
                            </td>)
                        }
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    </>;
}