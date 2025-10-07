const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Discord webhook (bạn có thể để trong biến môi trường nếu muốn ẩn)
const WEBHOOK_URL = "https://discord.com/api/webhooks/1424641624511742022/C5twyR6yJKijDynV_UKKfzm5C5zuSi8btkIgSFa_e_ovDOjF5NU-Yw1PdjOaNikcPWRE";

app.get("/", (req, res) => {
  res.send("✅ Roblox check server is running!");
});

app.get("/checkfollow", async (req, res) => {
  const { followerId, userId } = req.query;

  if (!followerId || !userId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Gửi log lên Discord
    await axios.post(WEBHOOK_URL, {
      content: `📩 New check:\nFollowerID: **${followerId}**\nUserID: **${userId}**`
    });

    // Gọi Roblox API
    const response = await axios.get(`https://friends.roblox.com/v1/users/${followerId}/followings`);
    const isFollowing = response.data.data.some(u => u.id == userId);

    res.json({ following: isFollowing });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
