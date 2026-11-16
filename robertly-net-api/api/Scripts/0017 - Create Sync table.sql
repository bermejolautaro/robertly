ALTER TABLE ExerciseLogs
ADD COLUMN ExerciseLogUuid UUID NULL;

UPDATE ExerciseLogs SET ExerciseLogUuid = gen_random_uuid();

ALTER TABLE ExerciseLogs
ADD CONSTRAINT UQ_ExerciseLogs_ExerciseLogUuid UNIQUE (ExerciseLogUuid);

CREATE TABLE SyncClients (
  SyncClientId INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  SyncClientUuid UUID NOT NULL UNIQUE,
  UserId INT NOT NULL REFERENCES Users (UserId),
  LastMutationId INT NOT NULL
);

DELETE FROM Series
WHERE NOT EXISTS (SELECT 1 FROM ExerciseLogs WHERE Series.ExerciseLogId = ExerciseLogs.ExerciseLogId);

ALTER TABLE Series
ADD CONSTRAINT FK_Series_ExerciseLogs FOREIGN KEY (ExerciseLogId) REFERENCES ExerciseLogs(ExerciseLogId) ON DELETE CASCADE;

CREATE INDEX IX_Series_ExerciseLogId ON Series (ExerciseLogId);

ALTER TABLE Series
ADD COLUMN Position INT NULL;

UPDATE Series
SET Position = (
  SELECT COUNT(*) FROM Series S2
  WHERE S2.ExerciseLogId = Series.ExerciseLogId
    AND S2.SerieId < Series.SerieId
);
