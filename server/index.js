const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const { listSessions, saveSession } = require("./session-store");

const app = express();
const port = Number(process.env.PORT || 3000);
const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const cssDir = path.join(rootDir, "src", "css");

app.use(express.json());
app.use("/dist", express.static(distDir));
app.use("/src/css", express.static(cssDir));

app.get("/api/health", (_request, response) => {
    response.json({ ok: true });
});

app.get("/api/sessions", (_request, response) => {
    response.json({ sessions: listSessions() });
});

app.post("/api/sessions", (request, response) => {
    try {
        const session = saveSession(request.body || {});
        response.status(201).json({ session });
    } catch (error) {
        response.status(400).json({
            error: error instanceof Error ? error.message : "Failed to save session.",
        });
    }
});

app.get("*", (_request, response) => {
    response.sendFile(path.join(rootDir, "index.html"));
});

app.listen(port, () => {
    if (!fs.existsSync(distDir)) {
        console.warn("dist directory is missing. Run the frontend build before starting the API server.");
    }

    console.log(`Timer server is listening on port ${port}`);
});
