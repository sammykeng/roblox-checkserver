const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || "https://discord.com/api/webhooks/1424641624511742022/C5twyR6yJKijDynV_UKKfzm5C5zuSi8btkIgSFa_e_ovDOjF5NU-Yw1PdjOaNikcPWRE"

// Basic rate limiting / spam protection (simple, for example)
const recent = new Map() // map userId -> timestamp
const COOLDOWN = 10 * 1000 // 10 seconds

app.post('/notify', async (req, res) => {
try {
const { userId, passed, source } = req.body
if (!userId) return res.status(400).json({ error: 'missing userId' })

// simple anti-spam: same user can't post too often
const now = Date.now()
const last = recent.get(userId) || 0
if (now - last < COOLDOWN) {
  return res.status(429).json({ error: 'too many requests' })
}
recent.set(userId, now)

// Build Discord message
const discordPayload = {
  content: `UserId **${userId}** passed. (source: ${source || 'unknown'})`
}

// Send to Discord webhook
const r = await axios.post(DISCORD_WEBHOOK, discordPayload)

// Optionally log or store in DB here
return res.status(200).json({ ok: true, discordStatus: r.status })


} catch (err) {
console.error('notify error', err?.response?.data || err.message || err)
return res.status(500).json({ error: 'server error' })
}
})

app.listen(PORT, () => {
console.log(Server listening on port ${PORT})
})
