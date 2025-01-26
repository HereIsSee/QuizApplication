using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizApp.Server.Models;

var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<PlayerContext>(opt => opt.UseInMemoryDatabase("Players"));

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

List<Question> questions = Question.GetQuestions(); ;

app.MapGet("/leaderboard", async (PlayerContext context) =>
{
    var topTenPlayers = await context.Players
        .OrderByDescending(p => p.Score)
        .Take(10)
        .ToListAsync();

    return topTenPlayers;
});


app.MapGet("/quiz", () =>
{
    return questions;
});

app.MapPost("/quiz", async (HttpRequest request, PlayerContext context) =>
{
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();

    // Parse the JSON payload into a dictionary
    var formData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(body);

    if (formData == null || !formData.ContainsKey("email"))
    {
        return Results.BadRequest("Invalid data received.");
    }

    int score = Player.CalculateScore(questions, formData);

    var player = new Player
    {
        Email = formData["email"],
        Score = score,
        Time = DateTime.UtcNow
    };

    // Add the player to the database
    await context.Players.AddAsync(player);
    await context.SaveChangesAsync();

    // Return the player's data
    return Results.Ok(player);
});

app.MapFallbackToFile("/index.html");

app.Run();
