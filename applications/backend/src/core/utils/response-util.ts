import type { Response } from 'express';

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

interface ResponseData {
  status: StatusCodeType;
  type?: ResponseType;
  response?: string;
  data?: unknown;
}

export interface ResponseWithData extends ResponseData {
  data: unknown;
}

export interface ResponseWithMessage extends ResponseData {
  type: ResponseType;
  response: string;
}

const send = (res: Response, responseData: ResponseData) => {
  const { response, type, status, data } = responseData;

  const responsePayload: Record<string, unknown> = {};
  if (response) responsePayload.response = response;
  if (type) responsePayload.type = type;
  if (data) responsePayload.data = data;

  res.status(status).json(responsePayload);
};

export const success = (
  res: Response,
  responseData: Omit<ResponseWithMessage, 'type'>
) => {
  send(res, { ...responseData, type: ResponseType.SUCCESS });
};

export const data = (res: Response, responseData: ResponseWithData) => {
  send(res, responseData);
};
