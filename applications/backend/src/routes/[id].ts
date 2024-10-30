import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  res.json({ path: req.params.id });
};
