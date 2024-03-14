using System.Collections.Generic;

namespace robertly;

public static class Mappings
{
    #region Logs
    public static Log ToLog(this LogDb logDb, string id) => new(id, logDb.User, logDb.ExerciseId, logDb.Date, logDb.Series ?? []);
    public static LogV2 ToLogV2(this LogDbV2 logDb, string id) => new(id, logDb.User, logDb.UserId, logDb.ExerciseId, logDb.Date, logDb.Series ?? []);

    #endregion

    #region Exercises
    public static Exercise ToExercise(this ExerciseDb exerciseDb, string id) => new(id, exerciseDb.Exercise, exerciseDb.MuscleGroup, exerciseDb.Type);
    #endregion

    #region Users
    public static User ToUser(this UserDb userDb, string id) => new(id, userDb.Uid, userDb.Email, userDb.DisplayName, []);
    #endregion
}