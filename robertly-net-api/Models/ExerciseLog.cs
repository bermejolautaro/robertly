using System;
using System.Collections.Generic;

namespace robertly.Models
{
    public record Serie()
    {
        public int? SerieId { get; init; }
        public int? ExerciseLogId { get; init; }
        public required int Reps { get; init; }
        public required decimal WeightInKg { get; init; }
    }

    public record ExerciseLogRequest()
    {
        public ExerciseLog? ExerciseLog { get; set; }
    }

    public record ExerciseLog()
    {
        public int? ExerciseLogId { get; init; }
        public string? ExerciseLogUsername { get; init; }
        public int? ExerciseLogUserId { get; init; }
        public int? ExerciseLogExerciseId { get; init; }
        public DateTime ExerciseLogDate { get; init; }

        // Joining with Exercises
        public Exercise? Exercise { get; init; }

        //public string? ExerciseName { get; init; }
        //public string? MuscleGroup { get; init; }
        //public string? Type { get; init; }

        // Joining with Users
        public User2? User { get; init; }

        //public string? UserFirebaseUuid { get; init; }
        //public string? Email { get; init; }
        //public string? Username { get; init; }

        // Joining with Series
        public IEnumerable<Serie>? Series { get; init; }
    }

    // TODO: Highlighted should be refactor to be more abstract
    public record ExerciseLogDto(
        int Id,
        User2 User,
        Exercise Exercise,
        DateTime Date,
        IEnumerable<Serie> Series,
        string? Highlighted,
        int? TotalReps,
        int Tonnage,
        int? Average
    );
}
