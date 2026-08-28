import { Router } from 'express';
const router = Router();
router.post('/', (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!name || !email || !message) return res.status(400).json({ ok: false, message: 'name, email and message are required' });
  console.log('[contact]', { name, email, message, receivedAt: new Date().toISOString() });
  return res.status(201).json({ ok: true, message: 'Message received' });
});
export default router;
