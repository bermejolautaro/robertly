using System;
using System.Collections.Generic;

namespace robertly.Models;

public record Serie()
{
  public int? SerieId { get; init; }
  public int? ExerciseLogId { get; init; }
  public int? Reps { get; init; }
  public decimal? WeightInKg { get; init; }
  public decimal? Brzycki { get; init; }
}

public record ExerciseLogRequest
{
  public Models.ExerciseLog? ExerciseLog { get; set; }
  public IEnumerable<int> SeriesIdsToDelete { get; set; } = [];
}

public record ExerciseLog
{
  public int? ExerciseLogId { get; set; }
  public int? ExerciseLogUserId { get; set; }
  public int? ExerciseLogExerciseId { get; set; }
  public DateTime ExerciseLogDate { get; set; }
  public int CreatedByUserId { get; set; }
  public DateTime CreatedAtUtc { get; set; }
  public int LastUpdatedByUserId { get; set; }
  public DateTime LastUpdatedAtUtc { get; set; }
  public int? TotalReps { get; set; }
  public int? Tonnage { get; set; }
  public decimal? AverageReps { get; set; }
  public decimal? AverageBrzycki { get; set; }
  public decimal? AverageEpley {get; set; }
  public decimal? AverageLander { get; set; }
  public decimal? AverageLombardi { get; set; }
  public decimal? AverageMayhew { get; set; }
  public decimal? AverageOConner { get; set; }
  public decimal? AverageWathan { get; set; }

  // Joining with Exercises
  public Models.Exercise? Exercise { get; init; }

  // Joining with Users
  public User? User { get; init; }

  // Joining with Series
  public IEnumerable<Serie>? Series { get; init; }

  public IEnumerable<Models.ExerciseLog>? RecentLogs { get; init; }
}

