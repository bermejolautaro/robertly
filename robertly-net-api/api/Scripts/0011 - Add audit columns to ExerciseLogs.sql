ALTER TABLE ExerciseLogs
ADD COLUMN CreatedByUserId INT NULL,
ADD COLUMN CreatedAtUtc TIMESTAMP NULL,
ADD COLUMN LastUpdatedByUserId INT NULL,
ADD COLUMN LastUpdatedAtUtc TIMESTAMP NULL;

UPDATE ExerciseLogs
SET CreatedByUserId = UserId,
    LastUpdatedByUserId = UserId;

UPDATE ExerciseLogs
SET CreatedAtUtc = Date,
    LastUpdatedAtUtc = Date;

ALTER TABLE ExerciseLogs
ALTER COLUMN CreatedByUserId SET NOT NULL,
ALTER COLUMN CreatedAtUtc SET NOT NULL,
ALTER COLUMN LastUpdatedByUserId SET NOT NULL,
ALTER COLUMN LastUpdatedAtUtc SET NOT NULL;

DELETE FROM ExerciseLogs WHERE UserFirebaseUuid IS NULL;

ALTER TABLE ExerciseLogs
ALTER COLUMN UserId SET NOT NULL,
ALTER COLUMN ExerciseId SET NOT NULL,
DROP COLUMN ExerciseLogFirebaseId,
DROP COLUMN Username,
DROP COLUMN UserFirebaseUuid,
DROP COLUMN ExerciseFirebaseId;

ALTER TABLE Series
DROP COLUMN ExerciseLogFirebaseId;