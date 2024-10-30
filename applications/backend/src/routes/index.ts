import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const cursor = parseInt(req.query.cursor as string) || 0;
  const pageSize = 50;

  const data = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      return {
        name: 'Project ' + (i + cursor) + ` (server time: ${Date.now()})`,
        id: i + cursor,
      };
    });

  const nextId = cursor < 500 ? data[data.length - 1].id + 1 : null;
  const previousId = cursor > 0 ? data[0].id - pageSize : null;

  console.log('data', data);

  setTimeout(() => res.json({ data, nextId, previousId }), 300);
};
