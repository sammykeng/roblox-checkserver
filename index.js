const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/checkfollow", async (req, res) => {
  const { followerId, userId } = req.query;

  if (!followerId || !userId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const response = await axios.get(`https://friends.roblox.com/v1/users/${followerId}/followings`);
    const isFollowing = response.data.data.some((u) => u.id == userId);
    res.json({ following: isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
