import express, { Request, Response } from 'express';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import wordRoutes from './routes/words';
import sessionsRoutes from './routes/sessions';
import evaluationsRoutes from './routes/evaluations';
import suggestionsRoutes from './routes/suggestions';
import wordsHeuristicStates from './routes/words_heuristic_states';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/evaluations', evaluationsRoutes);
app.use('/suggestions', suggestionsRoutes);
app.use('/api', wordRoutes);
app.use('/words-heuristic-states', wordsHeuristicStates);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is working', status: 'OK' });
});

export default app;