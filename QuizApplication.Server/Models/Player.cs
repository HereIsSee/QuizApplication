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
    }
}
