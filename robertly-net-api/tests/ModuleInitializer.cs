using System.Runtime.CompilerServices;
using DiffEngine;

namespace tests;

public static class ModuleInitializer
{
  [ModuleInitializer]
  public static void Initialize() =>
      DiffTools.UseOrder(DiffTool.VisualStudioCode, DiffTool.VisualStudio);
}