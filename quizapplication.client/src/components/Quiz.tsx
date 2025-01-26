import { useEffect, useState } from 'react';
import { Player } from '../interfaces/Player'
import { Question } from '../interfaces/Question'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';


function Quiz() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [submissionResult, setSubmissionResult] = useState<Player>();
    const [activeStep, setActiveStep] = useState(0);
    const [contentArray, setContentArray] = useState<JSX.Element[]>([]);
    const [formData, setFormData] = useState<{ [key: string]: string }>({});



    const steps = ["", "", "", "", "", "", "", "", "", "", "",]


    useEffect(() => {
        getQuestions();
    }, []);

    useEffect(() => {
        // Generate content when questions are updated
        if (questions.length > 0) {
            generateContent();
        }
    }, [questions]);

    const generateContent = () => {
        const content = [
            <div className="form-group mb-2" key="email">
                <label htmlFor="email">Enter your email:</label>
                <input
                    className="form-control"
                    type="email" id="email"
                    name="email"
                    required />
            </div>,
            ...questions.map((question, index) => (
                <div className="card mb-3" key={index}>
                    <div className="card-body">
                        <p className="card-title fw-bold">{question.title}</p>
                        <div className="card-text">{quizType(question)}</div>
                    </div>
                </div>
            )),
        ];
        setContentArray(content); // Save generated content to state
    };

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

    const getUpdatedData = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget; // Get the form element
        const formDataObj = new FormData(form); // Extract data from the form

        // Convert FormData to a plain object with comma-separated values for multiple answers
        const updatedData: { [key: string]: string } = { ...formData };
        formDataObj.forEach((value, key) => {
            if (updatedData[key]) {
                // If the key already exists, append the new value with a comma
                updatedData[key] += `,${value}`;
            } else {
                // Otherwise, set the initial value
                updatedData[key] = value as string;
            }
        });
        return updatedData;
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const updatedData = getUpdatedData(e);
        setFormData(updatedData); // Update the form data state

        // Move to the next step
        if (activeStep < questions.length)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };




    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedData = getUpdatedData(e);

        setFormData(updatedData); //wait until this is done then continue

        // Wait for the state update to propagate
        const updatedFormData = { ...updatedData };

        console.log(JSON.stringify(updatedFormData, null, 2));
        // Submit the form
        fetch('quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFormData),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to submit quiz');
            }
        })
            .then((data) => {
                setSubmissionResult(data);
            })
            .catch((error) => {
                console.error('Error during submission:', error);
            });

    };

    const handleTryAgain = () => {
        setActiveStep(0);
        setSubmissionResult(undefined)
    }

    //Generates the question into html depending on whay type of question it 
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


    //Questions being generated
    const contents = questions.length === 0
        ? <p><em>Loading... Reload the page if it's still not working</em></p>
        :
        <>
            <Stepper activeStep={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <form onSubmit={activeStep === questions.length ? handleSubmit : handleNext}>
                <Typography>
                    {contentArray[activeStep]}
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                >
                    Previous
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    color={activeStep === contentArray.length - 1 ? "success" : "primary"}
                >
                    {activeStep === contentArray.length - 1 ? 'Submit' : 'Next'}
                </Button>


            </form>
        </>

    //The Result is generated
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

            <button className="btn btn-primary mb-2" onClick={handleTryAgain} >Try again?</button>
        </div>
    );

    //Returns the questinos or resultsContent depending on if the player data is present
    return (
        <div>
            {submissionResult ? resultContent : contents}
        </div>
    );

    async function getQuestions() {
        try {
            const response = await fetch('quiz');

            if (response.ok) {
                const data = await response.json();
                //console.log(JSON.stringify(data, null, 2));
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