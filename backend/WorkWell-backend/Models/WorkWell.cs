using Google.Cloud.Firestore;
using WorkWell_backend.Types.Enum;

namespace WorkWell_backend.Models;

[FirestoreData]
public class WorkWell
{
    [FirestoreProperty(nameof(IdWWS))]
    public int IdWWS { get; set; }

    [FirestoreProperty(nameof(Name))]
    public required string Name { get; set; }

    [FirestoreProperty(nameof(Description))]
    public string? Description { get; set; }

    [FirestoreProperty(nameof(UpdateDate))]
    public DateTime UpdateDate { get; set; }

    [FirestoreProperty(nameof(ScheduleType))]
    public WorkWellScheduleType ScheduleType { get; set; }

    [FirestoreProperty(nameof(WorkWellSchedule))]
    public List<WorkWellSchedule>? WorkWellSchedule { get; set; }

    public WorkWell()
    {
        Name = string.Empty;
        Description = string.Empty;
        UpdateDate = DateTime.Now;
        ScheduleType = WorkWellScheduleType.STATIC;
        WorkWellSchedule = new List<WorkWellSchedule>();
    }

    public WorkWell(string name, string? description, DateTime updateDate, WorkWellScheduleType scheduleType, List<WorkWellSchedule>? workWellSchedule)
    {
        Name = name;
        Description = description;
        UpdateDate = updateDate;
        ScheduleType = scheduleType;
        WorkWellSchedule = workWellSchedule ?? new List<WorkWellSchedule>();
    }
}