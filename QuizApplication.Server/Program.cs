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
    return Question.GetQuestions();
})
.WithName("GetQuestions");

app.MapPost("/quiz", () =>
{
    return Results.Ok();
});

app.MapFallbackToFile("/index.html");

app.Run();
