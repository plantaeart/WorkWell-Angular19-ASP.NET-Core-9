using Google.Cloud.Firestore;
using WorkWell_backend.Types.Enum;
using DateTime = System.DateTime;

namespace WorkWell_backend.Models;

[FirestoreData]
public class WorkWellEvent
{
    [FirestoreProperty(nameof(StartDate))]
    public string StartDate { get; set; }

    [FirestoreProperty(nameof(EndDate))]
    public string EndDate { get; set; }

    [FirestoreProperty(nameof(EventType))]
    public WorkWellEventType EventType { get; set; }

    public WorkWellEvent()
    {
        StartDate = "09:00";
        EndDate = "18:00";
        EventType = WorkWellEventType.NONE;
    }

    public WorkWellEvent(string startDate, string endDate, WorkWellEventType eventType)
    {
        StartDate = startDate;
        EndDate = endDate;
        EventType = eventType;
    }
}