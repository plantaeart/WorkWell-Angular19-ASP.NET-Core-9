import { WorkWellEventType } from '../../types/enums/workWellEventType';

export class WorkWellEvent {
  startDate: string | Date; // Store time as a string in HH:mm format
  endDate: string | Date; // Store time as a string in HH:mm format
  eventType: WorkWellEventType;
  name: string; // Optional name for the event

  constructor(params: {
    startDate?: string | Date;
    endDate?: string | Date;
    eventType?: WorkWellEventType;
    name?: string;
  }) {
    // Set default startDate to "09:00"
    const defaultStartDate = '09:00';

    // Set default endDate to "18:00"
    const defaultEndDate = '18:00';

    this.startDate = params.startDate || defaultStartDate;
    this.endDate = params.endDate || defaultEndDate;
    this.eventType = params.eventType || WorkWellEventType.NONE;
    this.name = params.name || 'Event';
  }
}
