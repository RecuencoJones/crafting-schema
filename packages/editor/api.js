import express from 'express';
import 'express-async-errors';
import { parse } from '@crafting-schema/schema';

const app = express();

app.use(express.text());

app.post('/api/schema/parse', async (req, res) => {
  try {
    const value = await parse(req.body);

    res.json(value);
  } catch(e) {
    res.status(400).send(e.message);
  }
});

export const handler = app;
