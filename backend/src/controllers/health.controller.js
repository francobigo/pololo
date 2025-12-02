export const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando 🚀',
    timestamp: new Date().toISOString(),
  });
};
