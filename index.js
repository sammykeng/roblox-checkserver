const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/log', async (req, res) => {
const { userId, status } = req.body;

if (!userId) return res.status(400).json({ error: 'Missing userId' });

const message = `UserID: ${userId} | Status: ${status || 'passed'}`;

try {
await axios.post(process.env.WEBHOOK_URL, { content: message });
console.log('Sent to Discord:', message);
res.json({ success: true });
} catch (err) {
console.error('Error sending webhook:', err);
res.status(500).json({ error: 'Webhook failed' });
}
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
