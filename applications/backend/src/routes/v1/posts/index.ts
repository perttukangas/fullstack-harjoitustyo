import type { Handler } from 'express';
import { data } from '../../../core/utils/response-util';
import { StatusCodeType } from '../../../../../types/fetch';
import { getPage } from './_/prisma';

export const get: Handler = async (req, res) => {
  const cursor = parseInt(req.query.cursor as string) || 0;
  const pageSize = 20;

  const posts = await getPage(cursor, pageSize);
  const nextCursor = posts.length === pageSize ? cursor + pageSize : undefined;

  data(res, {
    status: StatusCodeType.OK,
    data: { page: posts, nextCursor },
  });
};
