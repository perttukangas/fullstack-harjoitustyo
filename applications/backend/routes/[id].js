export const get = async (req, res) => {
  return res.json({ path: req.params.id })
}