using System.Reflection.Metadata.Ecma335;

namespace QuizApp.Server.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public List<string> PossibleAnswers { get; set; } = new List<string>();
        public List<string> Answers { get; set; } = new List<string>();

        public Question(int id, string title, string type, List<string> possibleAnwsers, List<string> answers)
        {
            Id = id;
            Title = title;
            Type = type;
            PossibleAnswers = possibleAnwsers;
            Answers = answers;
        }

        public static List<Question> GetQuestions()
        {
            List<Question> questions = new List<Question>();

            questions.Add(new Question(
                1,
                "What is 6 + 10",
                "text input",
                new List<string>(),
                new List<string> { "16" }
                ));

            questions.Add(new Question(
                2,
                "What is the square root of 144",
                "text input",
                new List<string>(),
                new List<string> { "12" }
                ));

            questions.Add(new Question(
                3,
                "What is the most populous country on Earth?",
                "single anwser",
                new List<string> { "India", "China", "Philippines", "United States of America" },
                new List<string> { "India" }
                ));

            questions.Add(new Question(
                4,
                "What is the national animal of Scotland?",
                "single anwser",
                new List<string> { "Unicorn", "Duck", "Goat", "Eagle" },
                new List<string> { "Unicorn" }
                ));

            questions.Add(new Question(
                5,
                "How many days are there in a week?",
                "single anwser",
                new List<string> { "6", "3", "7", "4" },
                new List<string> { "Unicorn" }
                ));

            questions.Add(new Question(
                6,
                "How many seconds make one hour?",
                "single anwser",
                new List<string> { "600", "60", "3600", "1200" },
                new List<string> { "Unicorn" }
                ));

            questions.Add(new Question(
                7,
                "What is the smallest country in the world by land area?",
                "single anwser",
                new List<string> { "Singapore", "Vatican City", "Lichtenshtein", "Malta" },
                new List<string> { "Vatican City" }
                ));

            questions.Add(new Question(
                8,
                "Choose all the animals in this list",
                "multiple answers",
                new List<string> { "Dog", "Chair City", "Cat", "Giraffe" },
                new List<string> { "Dog", "Cat", "Giraffe" }
                ));

            questions.Add(new Question(
                9,
                "Choose all the countries in the list",
                "multiple answers",
                new List<string> { "France", "Florin", "Belgium", "Perida" },
                new List<string> { "France", "Belgium" }
                ));

            questions.Add(new Question(
                10,
                "Choose all the flowers in this list",
                "multiple answers",
                new List<string> { "Rose", "Dahlia", "Amara", "Celosia" },
                new List<string> { "Rose", "Dahlia" }
                ));



            return questions;

        }

    }
}
