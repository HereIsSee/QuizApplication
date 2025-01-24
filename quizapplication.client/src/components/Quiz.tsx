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

    const quizType = (question: Question) => {
        if (question.type === "text input") {
            return (
                <input type="text" name={question.id.toString()} />
            );
        } else if (question.type === "single anwser") {
            return (
                <>
                    {question.possibleAnswers.map(possibleAnswer => (
                        <div key={possibleAnswer}>
                            <input
                                type="radio"
                                id={question.id.toString().concat(possibleAnswer)}
                                name={question.id.toString()}
                                value={possibleAnswer}
                            />
                            <label htmlFor={question.id.toString().concat(possibleAnswer)}>{possibleAnswer}</label>
                        </div>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    {question.possibleAnswers.map(possibleAnswer => (
                        <div key={possibleAnswer}>
                            <input
                                type="checkbox"
                                id={question.id.toString().concat(possibleAnswer)}
                                name={question.id.toString()}
                                value={possibleAnswer}
                            />
                            <label htmlFor={question.id.toString().concat(possibleAnswer)}>{possibleAnswer}</label>
                        </div>
                    ))}
                </>
            );
        }
    };

    const contents = questions === undefined
    ? <p><em>Something went wrong, check API</em></p>
        :
        <form action="/quiz" method="post">
            <label htmlFor="email">Enter your email:</label>
            <input type="email" id="email" name="email"/>
            {questions.map(question =>
                <div>
                    <h2>{question.title}</h2>
                    {quizType(question)}
                </div>
            )}
            <button type="submit" className="btn btn-primary">Submit</button>
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