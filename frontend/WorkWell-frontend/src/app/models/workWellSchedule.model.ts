import { WorkWellDayType } from '../../types/enums/workWellDayType';
import { WorkWellEvent } from './workWellEvent.model';
import { WorkWellEventType } from '../../types/enums/workWellEventType';

export class WorkWellSchedule {
  idDay: WorkWellDayType;
  workDay: WorkWellEvent;
  meetings: WorkWellEvent[];
  lunch: WorkWellEvent;

  constructor(params: {
    idDay?: WorkWellDayType;
    workDay?: WorkWellEvent;
    meetings?: WorkWellEvent[];
    lunch?: WorkWellEvent;
  }) {
    this.idDay = params.idDay || WorkWellDayType.NONE;
    this.workDay =
      params.workDay ||
      new WorkWellEvent({
        eventType: WorkWellEventType.NONE,
      });
    this.meetings = params.meetings || new Array<WorkWellEvent>();
    this.meetings.forEach((meeting) => {
      meeting.eventType = WorkWellEventType.MEETING;
    });
    this.lunch =
      params.lunch ||
      new WorkWellEvent({
        eventType: WorkWellEventType.LUNCH,
      });
  }
}
