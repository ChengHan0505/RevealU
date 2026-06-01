import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { email, password, remember } = req.body;

  res.status(200).json({
    message: 'Login route ready for database integration.',
    user: { email },
    remember: Boolean(remember),
    receivedPassword: Boolean(password)
  });
});

authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  res.status(201).json({
    message: 'Register route ready for database integration.',
    user: { name, email },
    receivedPassword: Boolean(password)
  });
});
