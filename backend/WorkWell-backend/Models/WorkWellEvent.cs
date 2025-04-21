using Google.Cloud.Firestore;
using WorkWell_backend.Types.Enum;
using DateTime = System.DateTime;

namespace WorkWell_backend.Models;

[FirestoreData]
public class WorkWellEvent
{
    [FirestoreProperty(nameof(StartDate))]
    public DateTime StartDate { get; set; }

    [FirestoreProperty(nameof(EndDate))]
    public DateTime EndDate { get; set; }

    [FirestoreProperty(nameof(EventType))]
    public WorkWellEventType EventType { get; set; }

    public WorkWellEvent()
    {
        StartDate = DateTime.Now;
        EndDate = DateTime.Now.AddHours(1); // Default to 1 hour duration
        EventType = WorkWellEventType.NONE;
    }

    public WorkWellEvent(DateTime startDate, DateTime endDate, WorkWellEventType eventType)
    {
        StartDate = startDate;
        EndDate = endDate;
        EventType = eventType;
    }
}