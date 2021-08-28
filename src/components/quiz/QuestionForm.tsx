import { useEffect, useState } from "react";

import { Question } from "../../model/quiz";
import "./QuestionForm.css";

interface QuestionFormProps {
    question: Question;
    onSubmit: () => void;
    onCancel: () => void;
}

export function QuestionForm(props: QuestionFormProps) {
    const {question, onSubmit, onCancel} = props;
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!submitted) return;
        const timeoutId = setTimeout(() => {
            onSubmit();
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [submitted, onSubmit]);

    if (submitted) {
        const correct = selectedAnswerIndex === question.answer;
        const className = correct ? "correct-answer" : "wrong-answer";
        return <div className={className}>
            {
                correct ? "That's right!" : "Wrong answer!"
            }
        </div>;
    }

    return <div className="question-form">
        <p>{question.question}</p>
        <div className="choice-list">
            {
                question.choices.map((c, i) => {
                    const rowClassList = ["row", "mx-auto", "choice-row"];
                    const selected = selectedAnswerIndex === i;
                    if (selected) rowClassList.push("selected");
                    return <div key={i} className={rowClassList.join(" ")}>
                        <div className="col-1">
                            <input
                                className="my-auto"
                                type="radio"
                                value={i}
                                checked={selectedAnswerIndex === i}
                                name="answer"
                                onChange={() => setSelectedAnswerIndex(i)}
                            />
                        </div>
                        <div className="col choice">
                            {c}
                        </div>
                    </div>;
                })
            }
        </div>
        <button
            className="btn btn-sm"
            onClick={onCancel}
        >
            Get me out of here!
        </button>
        <button
            className="btn btn-sm"
            onClick={() => setSubmitted(true)}
            disabled={submitted || selectedAnswerIndex === -1}
        >
            That's my answer!
        </button>
    </div>;
}