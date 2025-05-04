import { WorkWellErrorType } from '../../../types/enums/workWellErrorType';

export class WorkWellResponse {
  errorType: WorkWellErrorType | null = null;
  errorMessage: string | null = null;

  constructor(params: {
    errorType?: WorkWellErrorType | null;
    errorMessage?: string | null;
  }) {
    this.errorType = params.errorType || null;
    this.errorMessage = params.errorMessage || null;
  }
}
