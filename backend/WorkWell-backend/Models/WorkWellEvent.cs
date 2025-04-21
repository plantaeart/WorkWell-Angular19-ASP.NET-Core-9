using WorkWell_backend.Types.Enum;

namespace WorkWell_backend.Models;

public class WorkWellEvent {
    public DateTime StartDate;
    public DateTime EndDate;
    public WorkWellEventType EventType;
}