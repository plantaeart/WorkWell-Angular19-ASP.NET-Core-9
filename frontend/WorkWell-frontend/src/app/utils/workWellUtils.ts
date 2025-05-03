import { WorkWellEvent } from '../models/workWellEvent.model';
import { convertTimeStringToDate, formatDateToHHmm } from './string.utils';

//* Converts the startDate and endDate of workDay, lunch, meetings, and pauses to Date objects
export function convertWorkWellTimeToDate(params: {
  workDay?: WorkWellEvent;
  lunch?: WorkWellEvent;
  meetings?: WorkWellEvent[];
  pauses?: WorkWellEvent[];
}) {
  // Convert startDate and endDate to Date for workDay if they are not already Date objects
  if (params.workDay) {
    if (params.workDay.startDate.constructor.name !== 'Date') {
      params.workDay.startDate = convertTimeStringToDate(
        params.workDay.startDate
      );
    }

    if (params.workDay.endDate.constructor.name !== 'Date') {
      params.workDay.endDate = convertTimeStringToDate(params.workDay.endDate);
    }
  }

  if (params.lunch) {
    // Convert startDate and endDate to Date for lunch if they are not already Date objects
    if (params.lunch.startDate.constructor.name !== 'Date') {
      params.lunch.startDate = convertTimeStringToDate(params.lunch.startDate);
    }

    if (params.lunch.endDate.constructor.name !== 'Date') {
      params.lunch.endDate = convertTimeStringToDate(params.lunch.endDate);
    }
  }

  if (params.meetings) {
    // Check if meetings exists, if yes, make sure start/endDate are Date objects
    if (params.meetings && params.meetings.length > 0) {
      for (let i = 0; i < params.meetings.length; i++) {
        const meeting = params.meetings[i];
        if (meeting.startDate.constructor.name !== 'Date') {
          meeting.startDate = convertTimeStringToDate(meeting.startDate);
        }
        if (meeting.endDate.constructor.name !== 'Date') {
          meeting.endDate = convertTimeStringToDate(meeting.endDate);
        }
      }
    }
  }

  if (params.pauses) {
    // Check if pauses exists, if yes, make sure start/endDate are Date objects
    if (params.pauses && params.pauses.length > 0) {
      for (let i = 0; i < params.pauses.length; i++) {
        const pause = params.pauses[i];
        if (pause.startDate.constructor.name !== 'Date') {
          pause.startDate = convertTimeStringToDate(pause.startDate);
        }
        if (pause.endDate.constructor.name !== 'Date') {
          pause.endDate = convertTimeStringToDate(pause.endDate);
        }
      }
    }
  }
}

//* Converts the startDate and endDate of workDay, lunch, meetings, and pauses to HH:mm string format
export function convertWorkWellTimeToString(params: {
  workDay?: WorkWellEvent;
  lunch?: WorkWellEvent;
  meetings?: WorkWellEvent[];
  pauses?: WorkWellEvent[];
}) {
  if (params.workDay) {
    // Convert startDate and endDate to HH:mm string for workDay if they are not already string objects
    if (params.workDay.startDate.constructor.name !== 'string') {
      params.workDay.startDate = formatDateToHHmm(
        params.workDay.startDate as Date
      );
    }

    if (params.workDay.endDate.constructor.name !== 'string') {
      params.workDay.endDate = formatDateToHHmm(params.workDay.endDate as Date);
    }
  }

  if (params.lunch) {
    // Convert startDate and endDate to HH:mm string for lunch if they are not already string objects
    if (params.lunch.startDate.constructor.name !== 'string') {
      params.lunch.startDate = formatDateToHHmm(params.lunch.startDate as Date);
    }

    if (params.lunch.endDate.constructor.name !== 'string') {
      params.lunch.endDate = formatDateToHHmm(params.lunch.endDate as Date);
    }
  }

  if (params.meetings) {
    // Check if meetings exists, if yes, make sure start/endDate are string objects
    if (params.meetings && params.meetings.length > 0) {
      for (let i = 0; i < params.meetings.length; i++) {
        const meeting = params.meetings[i];
        if (meeting.startDate.constructor.name !== 'string') {
          meeting.startDate = formatDateToHHmm(meeting.startDate as Date);
        }
        if (meeting.endDate.constructor.name !== 'string') {
          meeting.endDate = formatDateToHHmm(meeting.endDate as Date);
        }
      }
    }
  }

  if (params.pauses) {
    // Check if pauses exists, if yes, make sure start/endDate are string objects
    if (params.pauses && params.pauses.length > 0) {
      for (let i = 0; i < params.pauses.length; i++) {
        const pause = params.pauses[i];
        if (pause.startDate.constructor.name !== 'string') {
          pause.startDate = formatDateToHHmm(pause.startDate as Date);
        }
        if (pause.endDate.constructor.name !== 'string') {
          pause.endDate = formatDateToHHmm(pause.endDate as Date);
        }
      }
    }
  }
}
