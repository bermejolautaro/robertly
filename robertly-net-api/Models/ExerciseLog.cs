﻿using System;
using System.Collections.Generic;

namespace robertly.Models;

public record Serie()
{
  public int? SerieId { get; init; }
  public int? ExerciseLogId { get; init; }
  public required int Reps { get; init; }
  public required decimal WeightInKg { get; init; }
  public decimal? Brzycki { get; init; }
}

public record ExerciseLogRequest
{
  public ExerciseLog? ExerciseLog { get; set; }
}

public record ExerciseLog
{
  public int? ExerciseLogId { get; init; }
  public string? ExerciseLogUsername { get; init; }
  public int? ExerciseLogUserId { get; init; }
  public int? ExerciseLogExerciseId { get; init; }
  public DateTime ExerciseLogDate { get; init; }
  public int CreatedByUserId { get; set; }
  public DateTime CreatedAtUtc { get; set; }
  public int LastUpdatedByUserId { get; set; }
  public DateTime LastUpdatedAtUtc { get; set; }

  // Joining with Exercises
  public Exercise? Exercise { get; init; }

  // Joining with Users
  public User? User { get; init; }

  // Joining with Series
  public IEnumerable<Serie>? Series { get; init; }

  public IEnumerable<ExerciseLog>? RecentLogs { get; init; }
}

// TODO: Highlighted should be refactor to be more abstract
public record ExerciseLogDto
{
  public required int Id { get; init; }
  public required User User { get; init; }
  public required Exercise Exercise { get; init; }
  public required DateTime Date { get; init; }
  public required IEnumerable<Serie> Series { get; init; }
  public required string? Highlighted { get; init; }
  public required int? TotalReps { get; init; }
  public required int Tonnage { get; init; }
  public required decimal? Average { get; init; }
  public required decimal? BrzyckiAverage { get; init; }
  public required IEnumerable<ExerciseLogDto> RecentLogs { get; init; }
}

public record ExerciseLogsDto
{
  public required IEnumerable<ExerciseLogDto> Data { get; init; }
};