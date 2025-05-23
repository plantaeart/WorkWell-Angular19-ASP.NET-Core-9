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
    public string Description { get; set; }

    [FirestoreProperty(nameof(IsPlaying))]
    public bool IsPlaying { get; set; }

    [FirestoreProperty(nameof(IsLocked))]
    public bool IsLocked { get; set; }

    [FirestoreProperty(nameof(NbDayWork))]
    public int? NbDayWork { get; set; }

    [FirestoreProperty(nameof(AlertMinuteTimeBefore))]
    public int AlertMinuteTimeBefore { get; set; }

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
        IsPlaying = false;
        IsLocked = false;
        NbDayWork = null;
        AlertMinuteTimeBefore = 5;
        ScheduleType = WorkWellScheduleType.STATIC;
        WorkWellSchedule = new List<WorkWellSchedule>();
    }

    public WorkWell(string name, string? description, int? nbDayWork, int alertMinuteTimeBefore, DateTime updateDate, bool? isPlaying, bool? isLocked, WorkWellScheduleType scheduleType, List<WorkWellSchedule>? workWellSchedule)
    {
        Name = name;
        Description = description ?? string.Empty;
        NbDayWork = nbDayWork;
        AlertMinuteTimeBefore = alertMinuteTimeBefore;
        UpdateDate = updateDate;
        IsPlaying = isPlaying ?? false;
        IsLocked = isLocked ?? false;
        ScheduleType = scheduleType;
        WorkWellSchedule = workWellSchedule ?? new List<WorkWellSchedule>();
    }
}