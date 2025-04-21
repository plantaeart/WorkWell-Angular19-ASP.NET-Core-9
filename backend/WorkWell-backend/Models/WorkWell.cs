using WorkWell_backend.Types.Enum;

namespace WorkWell_backend.Models;

public class WorkWell
{
    public required int IdWWS { get; set; }
    public required int Name { get; set; }
    public string? Description { get; set; }
    public DateTime UpdateDate { get; set; }
    public WorkWellScheduleType ScheduleType { get; set; }
    public List<WorkWellSchedule>? WorkWellSchedule { get; set; }
}