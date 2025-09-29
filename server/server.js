const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS for Trello
app.use(cors({ origin: "https://trello.com" }));

// Serve static files from the root or public folder
app.use(express.static(path.join(__dirname, "../public")));

// Load SSL Certificates (inside /server)
const options = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
};


// Routes for Trello Power-Up
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/manifest.json", (req, res) => res.sendFile(__dirname + "/manifest.json"));
app.get("/client.js", (req, res) => res.sendFile(__dirname + "/client.js"));


// Start HTTPS Server
https.createServer(options, app).listen(443, () => {
  console.log("✅ Local HTTPS Server running at https://127.0.0.1/");
});
