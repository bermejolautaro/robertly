namespace robertly;

public static class Mappings
{
    #region Logs
    public static Log ToLog(this LogDb logDb, string id) => new(id, logDb.User, logDb.ExerciseId, logDb.Date, logDb.Series ?? []);
    public static LogV2 ToLogV2(this LogDbV2 logDb, string id) => new(id, logDb.User, logDb.UserId, logDb.ExerciseId, logDb.Date, logDb.Series ?? []);
    #endregion

    #region Users
    public static User ToUser(this UserDb userDb, string id) => new(int.Parse(id), userDb.Uid, userDb.Email, userDb.DisplayName, []);
    #endregion
}