import { WorkWellDayType } from '../../types/enums/workWellDayType';
import { WorkWellEvent } from './workWellEvent.model';
import { WorkWellEventType } from '../../types/enums/workWellEventType';

export class WorkWellSchedule {
  idDay: WorkWellDayType;
  workDay: WorkWellEvent | null;
  meetings: WorkWellEvent[] | null;
  lunch: WorkWellEvent | null;

  constructor(params: {
    idDay?: WorkWellDayType;
    workDay?: WorkWellEvent | null;
    meetings?: WorkWellEvent[] | null;
    lunch?: WorkWellEvent | null;
  }) {
    this.idDay = params.idDay || WorkWellDayType.NONE;
    this.workDay =
      params.workDay ||
      new WorkWellEvent({
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
        eventType: WorkWellEventType.NONE,
      });
    this.meetings = params.meetings || new Array<WorkWellEvent>();
    this.meetings.forEach((meeting) => {
      meeting.eventType = WorkWellEventType.MEETING;
    });
    this.lunch =
      params.lunch ||
      new WorkWellEvent({
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
        eventType: WorkWellEventType.LUNCH,
      });
  }
}
