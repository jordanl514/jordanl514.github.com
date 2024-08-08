import express from 'express'
import { AiConversation } from '../../ai-persona/index.js';
const app = express();
const port = 3000;
const client = new AiConversation()

app.use(express.json());

app.post('/api/openai', async (req, res) => {
    try {
        const { input } = req.body;
        const response = await client.initalPersonaPrompt(input);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
