import { WorkWellEventType } from '../../types/enums/workWellEventType';

export class WorkWellEvent {
  startDate: string; // Store time as a string in HH:mm format
  endDate: string; // Store time as a string in HH:mm format
  eventType: WorkWellEventType;

  constructor(params: {
    startDate?: string;
    endDate?: string;
    eventType?: WorkWellEventType;
  }) {
    // Set default startDate to "09:00"
    const defaultStartDate = '09:00';

    // Set default endDate to "18:00"
    const defaultEndDate = '18:00';

    this.startDate = params.startDate || defaultStartDate;
    this.endDate = params.endDate || defaultEndDate;
    this.eventType = params.eventType || WorkWellEventType.NONE;
  }
}
