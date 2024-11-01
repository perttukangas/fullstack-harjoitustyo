import type { Handler } from 'express';
import { data } from '@core/utils/response-util';
import { StatusCodeType } from '@commontypes/fetch';
import { getPage } from '@core/lib/prisma/comment';

export const get: Handler = async (req, res) => {
  const { id: idString } = req.params;
  const id = parseInt(idString);

  const cursor = parseInt(req.query.cursor as string) || 0;
  const pageSize = 20;

  const posts = await getPage(id, cursor, pageSize);
  const nextCursor = posts.length === pageSize ? cursor + pageSize : undefined;

  data(res, {
    status: StatusCodeType.OK,
    data: { page: posts, nextCursor },
  });
};
