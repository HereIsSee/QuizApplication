import { useEffect, useState } from 'react';
import { Player } from '../interfaces/Player'

interface Question {
    id: number;
    title: string;
    type: string;
    possibleAnswers: string[];
    answers: string[];
}

function Quiz() {
    const [questions, setQuestions] = useState<Question[]>();
    const [submissionResult, setSubmissionResult] = useState<Player>();
    
    useEffect(() => {
        getQuestions();
    }, []);


    const randomizeQuestions = (array: Question[]): Question[] => {
        const shuffledQuestions = [...array];

        // Randomize questions
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        // Randomize possible answers for each question
        for (const question of shuffledQuestions) {
            if (question.type !== "text input") {
                const shuffledAnswers = [...question.possibleAnswers];
                for (let i = shuffledAnswers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
                }
                question.possibleAnswers = shuffledAnswers;
            }
        }

        return shuffledQuestions;
    };



    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        fetch('quiz', {
            method: 'POST',
            body: formData,
        }).then((response) => {
            if (response.ok) {
                return response.json(); // Return the JSON data as a promise
            } else {
                console.error("Response error:", response.status, response.statusText);
                return Promise.reject("Failed to fetch data");
            }
        }).then((data) => {
            setSubmissionResult(data);
            if (questions) {
                setQuestions(randomizeQuestions(questions)); // Reshuffle existing questions
            }
            
        }).catch((error) => {
            console.error("Error:", error);
        });


    }

    const quizType = (question: Question) => {
        if (question.type === "text input") {
            return (
                <input
                    className="form-control"
                    type="text"
                    name={question.id.toString()}
                    required
                />
            );
        } else if (question.type === "single anwser") {
            return (
                <>
                    {question.possibleAnswers.map(possibleAnswer => (
                        <div key={possibleAnswer}>
                            <input
                                className="form-check-input" 
                                type="radio"
                                id={question.id.toString().concat(possibleAnswer)}
                                name={question.id.toString()}
                                value={possibleAnswer}
                                required 
                            />
                            <label
                                className="form-check-label"
                                htmlFor={question.id.toString().concat(possibleAnswer)}>{possibleAnswer}
                            </label>
                        </div>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    {question.possibleAnswers.map((possibleAnswer, index) => (
                        <div key={possibleAnswer}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={question.id.toString().concat(possibleAnswer)}
                                name={question.id.toString()}
                                value={possibleAnswer}
                                 
                            />
                            {index === 0 && (
                                <input
                                    type="hidden"
                                    value=""
                                    required
                                    style={{ display: "none" }}
                                    name={question.id.toString()}
                                />
                            )}
                            <label
                                className="form-check-label"
                                htmlFor={question.id.toString().concat(possibleAnswer)}>{possibleAnswer}
                            </label>
                        </div>
                    ))}
                </>
            );
        }
    };

    const contents = questions === undefined
        ? <p><em>Loading... Reload the page if it's still not working</em></p>
        :
        <form onSubmit={onSubmit}>
            <div className="form-group mb-2">
                <label htmlFor="email">Enter your email:</label>
                <input className="form-control" type="email" id="email" name="email" required />
            </div>

            {questions.map((question, index) => (
                <div className="card mb-3" key={index}>
                    <div className="card-body">
                        <p className="card-title fw-bold">{question.title}</p>
                        <div className="card-text">
                            {quizType(question)}
                        </div>
                    </div>
                </div>
            ))}

            <button type="submit" className="btn btn-primary mb-2">Submit</button>
        </form>

    const resultContent = submissionResult && (
        <div className="card text-center">
            <div className="card-header bg-success text-white">Success</div>
            <div className="card-body">
                <h5 className="card-title">Score Summary</h5>
                <p className="card-text">
                    <strong>Email:</strong> {submissionResult.email}
                </p>
                <p className="card-text">
                    <strong>Score:</strong> {submissionResult.score}
                </p>
                <p className="card-text">
                    <small className="text-muted">
                        Submitted on: {new Date(submissionResult.time).toLocaleString('en-GB')}
                    </small>
                </p>
            </div>

            <button className="btn btn-primary mb-2" onClick={() => setSubmissionResult(undefined)} >Try again?</button>
        </div>
    );

    return (
        <div>
            {submissionResult ? resultContent : contents}
        </div>
    );


    async function getQuestions() {
        try {
            const response = await fetch('quiz');

            console.log(JSON.stringify(response, null, 2));

            if (response.ok) {
                const data = await response.json();
                setQuestions(randomizeQuestions(data));

            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }

}

export default Quiz