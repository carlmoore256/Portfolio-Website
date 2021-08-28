import * as _ from "lodash";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import mcQuestions from "../../config/multiple-choice-questions.json";
import { Question } from "../../model/quiz";
import { QuestionForm } from "../quiz/QuestionForm";

export function TestPage(): JSX.Element {
    // each question is tied to a random number, which is the index of the cell which invokes the surprise question
    const [questionMap, setQuestionMap] = useState<Record<number, Question>>({});
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const [showQuestionDialog, setShowQuestionDialog] = useState(false);

    useEffect(() => {
        // assign quiz questions to special random natural numbers
        const qMap: Record<number, Question> = {};
        for (const q of mcQuestions) {
            let i: number;
            do {
                i = _.random(0, 100);
            } while (i in qMap);
            qMap[i] = q;
        }
        setQuestionMap(qMap);
    }, []);

    return <>
        <Modal
            show={showQuestionDialog}
            className="question-dialog"
            onHide={() => setShowQuestionDialog(false)}
        >
            <Modal.Body>
                {
                    activeQuestion == null ? <></> :
                        <QuestionForm
                            question={activeQuestion}
                            onSubmit={() => {
                                setShowQuestionDialog(false);
                            }}
                            onCancel={() => {
                                setShowQuestionDialog(false);
                            }}
                        />
                }
            </Modal.Body>
        </Modal>
        <h3>TEST ZONE, PLEASE WEAR YOUR HELMET!</h3>
        <h5>Avoid the particle beam!</h5>
        <h6>Don't poke the dragon!</h6>

        {
            _.range(0, 100).map(i => {
                const activeButton = i in questionMap;
                return <button
                    key={i}
                    onClick={() => {
                        if (!activeButton) return;
                        const q = questionMap[i];
                        setActiveQuestion(q);
                        setShowQuestionDialog(true);
                    }}
                >
                    {activeButton ? `${i}?` : i}
                </button>;
            })
        }

    </>;
}