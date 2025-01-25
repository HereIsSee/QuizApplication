import { useEffect, useState } from 'react';


interface Question {
    id: number;
    title: string;
    type: string;
    possibleAnswers: string[];
    answers: string[];
}

function Quiz() {
    const [questions, setQuestions] = useState<Question[]>();

    useEffect(() => {
        getQuestions();
    }, []);

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
            console.log("JSON Data:", JSON.stringify(data, null, 2)); // Log JSON data with pretty print
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

    return contents;

    async function getQuestions() {
        try {
            const response = await fetch('quiz');

            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }

}

export default Quiz