using WorkWell_backend.Types.Enum;

namespace WorkWell_backend.Models;

public class WorkWellSchedule
{
    public required WorkWellDayType IdDay { get; set; }
    public WorkWellEvent? WorkDay { get; set; }
    public List<WorkWellEvent>? Meetings { get; set; }
    public WorkWellEvent? Lunch { get; set; }

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