export interface ApiErrorDetail {
  path?: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: ApiErrorDetail[];
  };
}

export class CustomApiError extends Error {
  code?: string;
  details?: ApiErrorDetail[];
  status?: number;

  constructor(message: string, code?: string, details?: ApiErrorDetail[], status?: number) {
    super(message);
    this.name = 'CustomApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
