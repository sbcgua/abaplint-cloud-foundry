export interface ApiResponseStatus {
  success: number;
}

export interface ApiResponseSuccess<Payload> extends ApiResponseStatus {
  payload: Payload;
}

export interface ApiResponseError extends ApiResponseStatus {
  error: {
    message: string;
    // TODO details
  };
}

export function createErrorResponse(message: string): ApiResponseError {
  return {
    success: 0,
    error: { message }
  };
}

export function createSuccessStringResponse(payload: string): ApiResponseSuccess<string> {
  return {
    success: 1,
    payload,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiPayload = any;

export function createSuccessResponse(payload: ApiPayload): ApiResponseSuccess<ApiPayload> {
  return {
    success: 1,
    payload,
  };
}
