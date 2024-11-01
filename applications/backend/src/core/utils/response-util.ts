import type { Response } from 'express';
import {
  ResponseType,
  ResponseData,
  ResponseWithMessage,
  ResponseWithData,
} from '../../../../types/fetch';

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
