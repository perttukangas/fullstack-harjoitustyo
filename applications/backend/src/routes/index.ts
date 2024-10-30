import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  res.json({ Hello: 'World2!' });
};
