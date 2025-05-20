import { WorkWellEventType } from '../../types/enums/workWellEventType';
import {
  convertTimeStringToDate,
  formatDateToHHmm,
} from '../utils/string.utils';

export class WorkWellEvent {
  startDate: string; // Store time as a string in HH:mm format
  endDate: string; // Store time as a string in HH:mm format
  startDateDateFormat: Date = new Date(); // Store time as a Date
  endDateDateFormat: Date = new Date(); // Store time as a Date
  startDateTemp: Date = new Date(); // Temporary storage for start date
  endDateTemp: Date = new Date(); // Temporary storage for end date
  eventType: WorkWellEventType;
  name: string; // Optional name for the event

  constructor(params: {
    startDate?: string;
    endDate?: string;
    startDateDateFormat?: Date;
    endDateDateFormat?: Date;
    eventType?: WorkWellEventType;
    name?: string;
  }) {
    // Set default values
    const defaultStartDate = '09:00';
    const defaultEndDate = '18:00';

    // Case 1: If `startDate` and `endDate` are provided
    if (params.startDate && params.endDate) {
      this.startDate = params.startDate;
      this.endDate = params.endDate;
      this.startDateDateFormat = new Date(
        convertTimeStringToDate(this.startDate)
      );
      this.endDateDateFormat = new Date(convertTimeStringToDate(this.endDate));
      this.startDateTemp = this.startDateDateFormat;
      this.endDateTemp = this.endDateDateFormat;
    }
    // Case 2: If `startDateDateFormat` and `endDateDateFormat` are provided
    else if (params.startDateDateFormat && params.endDateDateFormat) {
      this.startDateDateFormat = params.startDateDateFormat;
      this.endDateDateFormat = params.endDateDateFormat;
      this.startDateTemp = params.startDateDateFormat;
      this.endDateTemp = params.endDateDateFormat;
      this.startDate = formatDateToHHmm(this.startDateDateFormat);
      this.endDate = formatDateToHHmm(this.endDateDateFormat);
    }
    // Case 3: If all are provided, prioritize `startDate`/`endDate` but ensure consistency
    else if (
      params.startDate &&
      params.endDate &&
      params.startDateDateFormat &&
      params.endDateDateFormat
    ) {
      this.startDate = params.startDate;
      this.endDate = params.endDate;
      this.startDateDateFormat = new Date(
        convertTimeStringToDate(this.startDate)
      );
      this.endDateDateFormat = new Date(convertTimeStringToDate(this.endDate));
      this.startDateTemp = this.startDateDateFormat;
      this.endDateTemp = this.endDateDateFormat;
    }
    // Case 4: If none are provided, use default values
    else {
      this.startDate = defaultStartDate;
      this.endDate = defaultEndDate;
      this.startDateDateFormat = new Date(
        convertTimeStringToDate(this.startDate)
      );
      this.endDateDateFormat = new Date(convertTimeStringToDate(this.endDate));
      this.startDateTemp = this.startDateDateFormat;
      this.endDateTemp = this.endDateDateFormat;
    }

    // Set other properties
    this.eventType = params.eventType ?? WorkWellEventType.NONE;
    this.name = params.name ?? 'Event';
  }

  setStartDate(startDate: string): void {
    this.startDate = startDate;
    this.startDateDateFormat = convertTimeStringToDate(startDate);
  }

  setEndDate(endDate: string): void {
    this.endDate = endDate;
    this.endDateDateFormat = convertTimeStringToDate(endDate);
  }

  setStartDateDateFormat(startDate: Date): void {
    this.startDateDateFormat = new Date(startDate);
    this.startDate = formatDateToHHmm(new Date(startDate));
  }

  setEndDateDateFormat(endDate: Date): void {
    this.endDateDateFormat = new Date(endDate);
    this.endDate = formatDateToHHmm(new Date(endDate));
  }

  equals(other: WorkWellEvent): boolean {
    return (
      this.startDate === other.startDate &&
      this.endDate === other.endDate &&
      this.eventType === other.eventType &&
      this.name === other.name
    );
  }
}
