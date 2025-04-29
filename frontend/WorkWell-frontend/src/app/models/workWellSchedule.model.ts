import { WorkWellDayType } from '../../types/enums/workWellDayType';
import { WorkWellEvent } from './workWellEvent.model';
import { WorkWellEventType } from '../../types/enums/workWellEventType';

export class WorkWellSchedule {
  idDay: WorkWellDayType;
  workDay: WorkWellEvent;
  meetings: WorkWellEvent[];
  lunch: WorkWellEvent;
  pauses: WorkWellEvent[];

  constructor(params: {
    idDay?: WorkWellDayType;
    workDay?: WorkWellEvent;
    meetings?: WorkWellEvent[];
    lunch?: WorkWellEvent;
    pauses?: WorkWellEvent[];
  }) {
    this.idDay = params.idDay || WorkWellDayType.NONE;
    this.workDay =
      params.workDay ||
      new WorkWellEvent({
        startDate: '09:00',
        endDate: '18:00',
        eventType: WorkWellEventType.WORKDAY,
      });
    this.meetings = params.meetings || new Array<WorkWellEvent>();
    this.meetings.forEach((meeting) => {
      meeting.eventType = WorkWellEventType.MEETING;
    });
    this.lunch =
      params.lunch ||
      new WorkWellEvent({
        startDate: '12:00',
        endDate: '14:00',
        eventType: WorkWellEventType.LUNCH,
      });

    this.pauses = params.pauses || new Array<WorkWellEvent>();
    this.pauses.forEach((pause) => {
      pause.eventType = WorkWellEventType.PAUSE;
    });
  }
}
