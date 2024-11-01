export enum ResponseType {
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum StatusCodeType {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_CONTENT = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export interface ResponseData {
  status: StatusCodeType
  type?: ResponseType
  response?: string
  data?: unknown
}

export interface ResponseWithData extends ResponseData {
  data: unknown
}

export interface ResponseWithMessage extends ResponseData {
  type: ResponseType
  response: string
}
