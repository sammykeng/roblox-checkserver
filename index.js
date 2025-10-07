const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let passedUsers = new Set(); // lưu userId đã pass

// Khi Lua gửi userId (đã chọn)
app.post("/notify", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  passedUsers.add(userId);
  console.log("✅ New user added:", userId);

  try {
    await axios.post(
      "https://discord.com/api/webhooks/1424641624511742022/C5twyR6yJKijDynV_UKKfzm5C5zuSi8btkIgSFa_e_ovDOjF5NU-Yw1PdjOaNikcPWRE",
      { content: `✅ Passed user: ${userId}` }
    );
  } catch (err) {
    console.error("Discord webhook error:", err.message);
  }

  res.json({ success: true });
});

// Check user có trong danh sách chưa
app.get("/checkUser", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const exists = passedUsers.has(userId);
  res.json({ exists });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
