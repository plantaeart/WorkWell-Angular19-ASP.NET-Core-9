import { WorkWellEvent } from '../models/workWellEvent.model';
import { convertTimeStringToDate } from './string.utils';

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
