import { ResponseType, ResponseData } from '../../../../types/fetch';

export const get = async (url: RequestInfo | URL, payload?: unknown) => {
  return await commonBody(url, 'GET', payload);
};

export const getData = async (url: RequestInfo | URL, payload?: unknown) => {
  return await commonBody(url, 'GET', payload, true);
};

export const post = async (url: RequestInfo | URL, payload: unknown) => {
  return await commonBody(url, 'POST', payload);
};

export const put = async (url: RequestInfo | URL, payload: unknown) => {
  return await commonBody(url, 'PUT', payload);
};

export const remove = async (url: RequestInfo | URL, payload: unknown) => {
  return await commonBody(url, 'DELETE', payload);
};

const commonBody = async (
  url: RequestInfo | URL,
  method: string,
  payload?: unknown,
  requireDataInResponse?: boolean
) => {
  const fetchOptions: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (payload) {
    fetchOptions.body = JSON.stringify(payload);
  }

  const response = await fetch(url, fetchOptions);
  return await responseToJson(response, requireDataInResponse ?? false);
};

const responseToJson = async (
  response: Response,
  requireDataInResponse: boolean
): Promise<Omit<ResponseData, 'status'>> => {
  const contentType = response.headers.get('Content-Type');
  if (!response.ok || !contentType?.includes('application/json')) {
    return {
      response: 'Internal server error',
      type: ResponseType.ERROR,
    };
  }

  const jsonResponse = (await response.json()) as ResponseData;

  // If data was explicitly requested, only check that it exists
  // Otherwise assume the desired response contains response and type
  if (requireDataInResponse) {
    if (!jsonResponse.data) {
      throw Error('Response should have included data...');
    }
  } else if (!jsonResponse.type || !jsonResponse.response) {
    throw Error('Response did not use proper response format...');
  }

  return jsonResponse;
};
