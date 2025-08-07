CREATE TABLE Goals (
    GoalId SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    GoalType VARCHAR(50) NOT NULL,
    TargetValue DECIMAL(8,2) NOT NULL,
    TargetDate DATE NULL,
    ExerciseId INT NULL,
    MuscleGroup VARCHAR(50) NULL,
    CreatedAtUtc TIMESTAMP WITHOUT TIME ZONE NOT NULL
);