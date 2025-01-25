using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.ComponentModel.DataAnnotations;

namespace QuizApp.Server.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int Score { get; set; }
        public DateTime Time { get; set; }

        public static int CalculateScore(List<Question> questions, Dictionary<string, string> playerAnswers)
        {
            int score = 0;

            foreach(Question question in questions)
            {
                if (!playerAnswers.ContainsKey(question.Id.ToString()))
                {
                    continue;
                }
                var answer = playerAnswers[question.Id.ToString()];

                if(answer != null)
                {
                    switch(question.Type)
                    {
                        case "text input":
                            if (answer == question.Answers[0])
                            {
                                score += 100;
                            }
                            break;
                        case "single anwser":
                            if (answer == question.Answers[0])
                            {
                                Console.WriteLine(answer);
                                score += 100;
                            }

                            break;

                        case "multiple answers":
                            int correctAnwsers = 0;
                            foreach (string questionAnswer in question.Answers)
                            {
                                Console.WriteLine(questionAnswer);
                                foreach (string playerAnwser in answer.Split(','))
                                {
                                    Console.WriteLine(playerAnwser);
                                    if (questionAnswer == playerAnwser)
                                    {
                                        correctAnwsers++;
                                        break;
                                    }

                                }
                            }
                            double result = (100.0 / question.Answers.Count) * correctAnwsers;
                            score += (int)Math.Round(result);
                            break;

                        default:
                            
                            break;
                    }
                }
            }

            return score;
        }
    }
}
