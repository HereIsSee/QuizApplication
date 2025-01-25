using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizApp.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
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
})
.WithName("GetTopTenPlayers");


app.MapGet("/quiz", () =>
{
    return questions;
})
.WithName("GetQuestions");

app.MapPost("/quiz", async (HttpRequest request, PlayerContext context) =>
{
    var form = await request.ReadFormAsync();

    // Retrieve all posted data
    var formData = form.ToDictionary(k => k.Key, v => v.Value.ToString());

    int score = Player.CalculateScore(questions, formData);

    var player = new Player
    {
        Email = formData["email"],
        Score = score,
        Time = DateTime.UtcNow // Capture the current time
    };

    // Add the player to the database
    await context.Players.AddAsync(player);
    await context.SaveChangesAsync();

    // Return a success message or the player's data
    return Results.Ok(new { message = "Player added successfully!", player });
    //Player playerData = new Player(form["email"], )

    // Log or return the data
    //return Results.Ok(formData);

});

app.MapFallbackToFile("/index.html");

app.Run();
