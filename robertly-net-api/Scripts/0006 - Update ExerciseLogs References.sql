UPDATE ExerciseLogs el
    SET ExerciseId = e.ExerciseId
FROM Exercises e
WHERE el.ExerciseFirebaseId = e.ExerciseFirebaseId;

UPDATE ExerciseLogs el
    SET UserId = u.UserId
FROM Users u
WHERE el.UserFirebaseUuid = u.UserFirebaseUuid;

UPDATE Series s
    SET ExerciseLogId = el.ExerciseLogId
FROM ExerciseLogs el
WHERE el.ExerciseLogFirebaseId = s.ExerciseLogFirebaseId;