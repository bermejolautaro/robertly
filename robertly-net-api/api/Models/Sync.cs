using System;
using System.Collections;
using System.Collections.Generic;

namespace robertly.Models;

public class ExerciseLogsSyncPushRequest
{
  public IEnumerable<Models.ExerciseLog> Creates { get; set; } = [];
  public IEnumerable<Models.ExerciseLog> Updates { get; set; } = [];
  public IEnumerable<int> Deletes { get; set; } = [];
  public IEnumerable<int> SeriesIdsToDelete { get; set; } = [];
}

public class ExerciselogsSyncPullResponse
{
  public IEnumerable<Models.ExerciseLog> ExerciseLogs { get; set; } = [];
  public DateTime ServerTimeUtc { get; set; }
}
