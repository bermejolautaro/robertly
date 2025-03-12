using System.Linq;
using System.Net.Sockets;
using System.Reflection;

namespace robertly.Helpers;

public static class GenericMapper
{
  public static TTarget Map<TTarget>(this object source) where TTarget : new()
  {
    var target = new TTarget();
    var sourceType = source.GetType();
    var targetType = typeof(TTarget);

    var sourceProperties = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
    var targetProperties = targetType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

    foreach (var targetProp in targetProperties)
    {
      var sourceProp = sourceProperties.FirstOrDefault(x => x.Name == targetProp.Name && x.PropertyType == targetProp.PropertyType);

      if (sourceProp is not null && sourceProp.CanRead && sourceProp.CanWrite)
      {
        var value = sourceProp.GetValue(source);
        targetProp.SetValue(target, value);
      }
    }

    return target;
  }
}