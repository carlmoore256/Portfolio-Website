import { Hangman } from "../examples/Hangman";
import React, { FunctionComponent, useState } from "react";
import styles from "./ReactExamplesPage.module.scss";
import { Minesweeper } from "../examples/minesweeper/Minesweeper";

interface Example {
    name: string;
    component: FunctionComponent;
    file: string;
}

const EXAMPLES: Example[] = [
    {
        name: "Hangman",
        component: Hangman,
        file: "src/components/examples/Hangman.tsx"
    },
    {
        name: "Minesweeper",
        component: Minesweeper,
        file: "src/components/examples/Minesweeper.tsx"
    }
]

export function ReactExamplesPage(): JSX.Element {
    const [selectedExampleIndex, setSelectedExampleIndex] = useState(-1);

    const selectedExample = selectedExampleIndex === -1 ? null : EXAMPLES[selectedExampleIndex];

    const Content = selectedExample?.component ?? React.Fragment;

    return <>
        <div>
            {
                EXAMPLES.map((e, i) => {
                    return <span
                        className={styles.fakeLink}
                        key={i}
                        onClick={() => setSelectedExampleIndex(i)}
                    >{e.name}</span>
                })
            }
        </div>
        <div>
            <Content/>
        </div>
    </>
}