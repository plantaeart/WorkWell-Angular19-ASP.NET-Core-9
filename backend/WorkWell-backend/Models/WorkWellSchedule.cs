using Google.Cloud.Firestore;
using WorkWell_backend.Types.Enum;

namespace WorkWell_backend.Models;

[FirestoreData]
public class WorkWellSchedule
{
    [FirestoreProperty(nameof(IdDay))]
    public required WorkWellDayType IdDay { get; set; }

    [FirestoreProperty(nameof(WorkDay))]
    public WorkWellEvent? WorkDay { get; set; }

    [FirestoreProperty(nameof(Meetings))]
    public List<WorkWellEvent>? Meetings { get; set; }

    [FirestoreProperty(nameof(Lunch))]
    public WorkWellEvent? Lunch { get; set; }

    public WorkWellSchedule()
    {
        IdDay = WorkWellDayType.NONE;
        WorkDay = new WorkWellEvent
        {
            EventType = WorkWellEventType.NONE
        };
        Meetings = new List<WorkWellEvent>();
        // Update EventType for each element in the Meetings list
        foreach (var meeting in Meetings)
        {
            meeting.EventType = WorkWellEventType.MEETING;
        }
        Lunch = new WorkWellEvent
        {
            EventType = WorkWellEventType.LUNCH
        };
    }

    public WorkWellSchedule(WorkWellDayType idDay)
    {
        IdDay = idDay;
        WorkDay = new WorkWellEvent
        {
            EventType = WorkWellEventType.NONE
        };
        Meetings = new List<WorkWellEvent>();
        // Update EventType for each element in the Meetings list
        foreach (var meeting in Meetings)
        {
            meeting.EventType = WorkWellEventType.MEETING;
        }
        Lunch = new WorkWellEvent
        {
            EventType = WorkWellEventType.LUNCH
        };
    }
}