CREATE TABLE ExerciseLogs (
    ExerciseLogId SERIAL PRIMARY KEY,
    ExerciseLogFirebaseId VARCHAR NOT NULL,
    Username VARCHAR NULL,
    UserId INT NULL,
    UserFirebaseUuid VARCHAR NULL,
    ExerciseId INT NULL,
    ExerciseFirebaseId VARCHAR NOT NULL,
    Date DATE NOT NULL
);

CREATE TABLE Series (
    SerieId SERIAL PRIMARY KEY,
    ExerciseLogId INT NOT NULL,
    ExerciseLogFirebaseId VARCHAR NOT NULL,
    Reps INT NOT NULL,
    WeightInKg DECIMAL NOT NULL
);

CREATE TABLE Users (
    UserId SERIAL PRIMARY KEY,
    UserFirebaseUuid VARCHAR NOT NULL,
    Email VARCHAR NOT NULL,
    Name VARCHAR NOT NULL
);

CREATE TABLE Exercises (
    ExerciseId SERIAL PRIMARY KEY,
    ExerciseFirebaseId VARCHAR NOT NULL,
    Name VARCHAR NOT NULL,
    MuscleGroup VARCHAR NOT NULL,
    Type VARCHAR NOT NULL
);
