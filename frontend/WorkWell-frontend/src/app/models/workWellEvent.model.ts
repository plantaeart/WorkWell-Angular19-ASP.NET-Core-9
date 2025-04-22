import { WorkWellEventType } from '../../types/enums/workWellEventType';

export class WorkWellEvent {
  startDate: Date;
  endDate: Date;
  eventType: WorkWellEventType;

  constructor(params: {
    startDate?: Date;
    endDate?: Date;
    eventType?: WorkWellEventType;
  }) {
    this.startDate = params.startDate || new Date();
    this.endDate =
      params.endDate || new Date(new Date().getTime() + 60 * 60 * 1000);
    this.eventType = params.eventType || WorkWellEventType.NONE;
  }
}
