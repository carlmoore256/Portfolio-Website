import React, { useCallback, useState } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

function evalInContext(js: string, context: any = undefined) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    // eslint-disable-next-line no-eval
    function f() { return eval(js); }
    return f.call(context);
}

function registerFunction(f: Function){
    (window as any)[(f as any).name] = f;
}

interface ChallengeProps {
    onCorrectAnswer: (feedback: string) => void;
    onWrongAnswer: (feedback: string) => void;
}

function randomString(n: number) {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    let s = "";
    for(let i=0;i<n;i++){
        const c = alpha[Math.floor(Math.random()*alpha.length)];
        s += c;
    }
    return s;
}

const _reverseString = (s: string) => s.split("").reduce((p,c)=>c+p,"");

function HelloChallenge(props: ChallengeProps): JSX.Element {
    const { onCorrectAnswer, onWrongAnswer } = props;
    const [userSolution, setUserSolution] = useState("");

    const checkSolution = useCallback(() => {
        const code = `${userSolution}\nregisterFunction(reverseString)`;
        evalInContext(code, {window, registerFunction});
        // @ts-ignore
        const testFunc = window.reverseString ?? null;

        if (testFunc == null) {
            onWrongAnswer("could not find the function 'reverseString'");
            return;
        }

        const toReverse = randomString(10);
        const expected = _reverseString(toReverse);
        const actual = testFunc(toReverse);
        if (actual === expected) {
            onCorrectAnswer("Yes! Amazing work!");
        } else {
            onWrongAnswer(`No, no, no! '${actual}' is not '${toReverse}' backwards.`);
        }
    }, [userSolution, onCorrectAnswer, onWrongAnswer]);
    return <>
        <div className="pane">
            This challenge is to test the challenge system itself.
            Define a function called reverseString which reverses a string.
            For example, reverseString("taco") should return "ocat".
        </div>
        <AceEditor
            value={userSolution}
            mode="javascript"
            onChange={code => setUserSolution(code)}
        />
        <button onClick={checkSolution}>Check Solution</button>
    </>;
}

const CHALLENGES = [
    HelloChallenge
];

export function JSChallengePage() {
    const [level, setLevel] = useState(0);
    const [feedback, setFeedback] = useState("");

    const onCorrectAnswer = useCallback((feedback: string) => {
        setLevel(level+1);
        setFeedback(feedback);
    }, [level]);

    const onWrongAnswer = useCallback((feedback: string) => {
        setFeedback(feedback);
    }, []);

    if (level >= CHALLENGES.length) {
        return <>YOU DID IT! YOU SOLVED ALL THE CHALLENGES.</>;
    }

    const challengeProps: ChallengeProps = {
        onCorrectAnswer,
        onWrongAnswer
    };

    const C = CHALLENGES[level];

    return <>
        {feedback === "" ? <></> : <div className="pane">{feedback}</div>}
        <C {...challengeProps}/>
    </>;
}

