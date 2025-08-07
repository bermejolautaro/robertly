using System;

namespace robertly.Models;

public record Goal
{
  public int GoalId { get; set; }
  public int UserId { get; set; }
  public string? GoalType { get; set; }
  public decimal TargetValue { get; set; }
  public DateTime? TargetDate { get; set; }
  public int? ExerciseId { get; set; }
  public string? MuscleGroup { get; set; }
  public DateTime CreatedAtUtc { get; set; }
}