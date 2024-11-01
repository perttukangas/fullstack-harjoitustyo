import type { Handler } from 'express';
import { data } from '@core/utils/response-util';
import { StatusCodeType } from '@commontypes/fetch';
import { getOne } from '@core/lib/prisma/post';

export const get: Handler = async (req, res) => {
  const { id } = req.params;

  const post = await getOne(parseInt(id));
  data(res, { status: StatusCodeType.OK, data: post });
};
