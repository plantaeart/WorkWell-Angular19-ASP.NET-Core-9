import { WorkWellDayType } from '../../types/enums/workWellDayType';
import { WorkWellEvent } from './workWellEvent.model';
import { WorkWellEventType } from '../../types/enums/workWellEventType';
import { lunchName } from '../../types/enums/workWellEventName';

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
    this.idDay = params.idDay ?? WorkWellDayType.NONE;

    // Initialize workDay
    this.workDay = params.workDay
      ? new WorkWellEvent({
          startDate: params.workDay.startDate,
          endDate: params.workDay.endDate,
          name: params.workDay.name,
          eventType: params.workDay.eventType,
        })
      : new WorkWellEvent({
          startDate: '09:00',
          endDate: '18:00',
          eventType: WorkWellEventType.WORKDAY,
        });

    // Initialize meetings
    this.meetings = (params.meetings ?? []).map(
      (meeting) =>
        new WorkWellEvent({
          startDate: meeting.startDate,
          endDate: meeting.endDate,
          name: meeting.name,
          eventType: WorkWellEventType.MEETING,
        })
    );

    // Initialize lunch
    this.lunch = params.lunch
      ? new WorkWellEvent({
          startDate: params.lunch.startDate,
          endDate: params.lunch.endDate,
          name: params.lunch.name,
          eventType: params.lunch.eventType,
        })
      : new WorkWellEvent({
          startDate: '12:00',
          endDate: '14:00',
          name: lunchName,
          eventType: WorkWellEventType.LUNCH,
        });

    // Initialize pauses
    this.pauses = (params.pauses ?? []).map(
      (pause) =>
        new WorkWellEvent({
          startDate: pause.startDate,
          endDate: pause.endDate,
          name: pause.name,
          eventType: WorkWellEventType.PAUSE,
        })
    );
  }

  public allEvents(): WorkWellEvent[] {
    return [this.lunch, ...this.meetings, ...this.pauses];
  }
}
