using System.ComponentModel.DataAnnotations;

namespace QuizApp.Server.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int Score { get; set; }
        public DateTime Time { get; set; }

        public Player(int id, string email, int score, DateTime time)
        {
            Id = id;
            Email = email;
            Score = score;
            Time = time;
        }

        public static int CalculateScore(List<Question> questions, Dictionary<string, string> playerAnswers)
        {
            foreach(Question question in questions)
            {
                var pair = playerAnswers[question.Id.ToString()];

                if(pair != null)
                {
                    switch(question.Type)
                    {
                        case "text input":

                            break;
                        case "single anwser":

                            break;

                        case "multiple answers":

                            break;

                        default:

                            break;
                    }
                }
            }

            return 0;
        }
    }
}
