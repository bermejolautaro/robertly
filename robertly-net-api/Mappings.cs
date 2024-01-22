namespace robertly;

public static class Mappings
{
    #region Logs
    public static Log ToLog(this LogDb logDb, string id) => new(id, logDb.User, logDb.ExerciseId, logDb.Date, logDb.Series ?? []);
    #endregion

    #region Exercises
    public static Exercise ToExercise(this ExerciseDb exerciseDb, string id) => new(id, exerciseDb.Exercise, exerciseDb.MuscleGroup, exerciseDb.Type);
    #endregion
}