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

List<Question> questions;

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
    questions = Question.GetQuestions();
    return questions;
})
.WithName("GetQuestions");

app.MapPost("/quiz", async (HttpRequest request) =>
{
    var form = await request.ReadFormAsync();

    // Retrieve all posted data
    var formData = form.ToDictionary(k => k.Key, v => v.Value.ToString());

    //Player playerData = Player.

    // Log or return the data
    return Results.Ok(formData);

    //return Results.Ok();
});

app.MapFallbackToFile("/index.html");

app.Run();
