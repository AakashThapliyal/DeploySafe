const express = require("express");
const path = require("path");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
    res.json({ status: "Healthy", project: "DeploySafe Portfolio" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 DeploySafe Portfolio running on port ${PORT}`);
});