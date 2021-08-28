import { useCallback } from "react";
import { CellData } from "./types";
import styles from "./Minesweeper.module.scss";

// reminder: "Props" interfaces define what attributes a react component requires/accepts
// the name props itself is just convention
export interface CellProps {
    data: CellData;
    onReveal: () => void;
    onFlag: () => void;
}

/** this component renders a single cell */
export function Cell(props: CellProps): JSX.Element {
    const {data, onReveal, onFlag} = props;
    const {isMine, isRevealed, adjacentMineCount, flagState} = data;

    const classList = [styles.cell];
    let text = "";
    if (isRevealed) {
        classList.push(styles.revealed);
        if (isMine) {
            text = "*";
            classList.push(styles.mine);
        } else if (adjacentMineCount > 0) {
            text = `${adjacentMineCount}`;
        }
    }
    else if (flagState === "flag") {
        text = "!";
        classList.push(styles.flag);
    }
    else if (flagState === "question") {
        text = "?";
    }

    const onClick = useCallback(() => {
        if (isRevealed) return;
        onReveal();
    }, [isRevealed, onReveal]);

    // handle right click
    const onRightClick = useCallback((event: any) => {
        event.preventDefault();
        onFlag();
        return false;
    }, [onFlag]);

    return <div
        className={classList.join(" ")}
        onClick={onClick}
        onContextMenu={onRightClick}
    >
        {text}
    </div>;
}

