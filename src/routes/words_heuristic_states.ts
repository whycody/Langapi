import { Router, Request, Response } from 'express';
import WordHeuristicState from '../models/WordHeuristicState';
import authenticate from '../middleware/auth';

const router = Router();

const nowUTC = () => new Date().toISOString();

router.get('/', authenticate, async (req: Request, res: Response) => {
  const { since } = req.query;
  const userId = req.userId ?? '';

  const query: { userId: string; updatedAt?: { $gt: Date } } = { userId };

  if (since) {
    query.updatedAt = { $gt: new Date(since as string) };
  }

  try {
    const states = await WordHeuristicState.find(query).lean();
    const mapped = states.map(state => ({
      ...state,
      wordId: state._id,
      _id: undefined,
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Error fetching WordHeuristicStates:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

router.post('/sync', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId ?? '';
  const clientStates = req.body;
  const syncedStates: { wordId: string; updatedAt?: Date }[] = [];

  for (const state of clientStates) {
    try {
      const existing = await WordHeuristicState.findOne({ _id: state.wordId, userId });

      if (existing && new Date(state.locallyUpdatedAt) < new Date(existing.updatedAt || 0)) {
        continue;
      }

      const updated = await WordHeuristicState.findOneAndUpdate(
        { _id: state.wordId, userId },
        { $set: { ...state, userId, updatedAt: nowUTC() } },
        { upsert: true, new: true }
      );

      syncedStates.push({
        wordId: updated._id as string,
        updatedAt: updated.updatedAt
      });
    } catch (error) {
      console.error(`Failed to sync state ${state.wordId}:`, error);
    }
  }

  res.json(syncedStates);
});

export default router;