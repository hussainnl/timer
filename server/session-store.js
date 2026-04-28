const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
const schemaPath = path.join(dataDir, "schema.sql");
const databasePath = path.join(dataDir, "timer.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(databasePath);
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

const insertSessionStatement = db.prepare(`
    INSERT INTO sessions (name, duration_seconds, completed_at)
    VALUES (@name, @duration_seconds, @completed_at)
`);

const listSessionsStatement = db.prepare(`
    SELECT
        id,
        name,
        duration_seconds AS durationSeconds,
        completed_at AS completedAt
    FROM sessions
    ORDER BY datetime(completed_at) DESC, id DESC
`);

function listSessions() {
    return listSessionsStatement.all();
}

function saveSession({ name, durationSeconds }) {
    const trimmedName = typeof name === "string" ? name.trim() : "";

    if (!trimmedName) {
        throw new Error("Session name is required.");
    }

    if (!Number.isInteger(durationSeconds) || durationSeconds <= 0) {
        throw new Error("Session duration must be a positive integer.");
    }

    const completedAt = new Date().toISOString();
    const result = insertSessionStatement.run({
        name: trimmedName,
        duration_seconds: durationSeconds,
        completed_at: completedAt,
    });

    return {
        id: result.lastInsertRowid,
        name: trimmedName,
        durationSeconds,
        completedAt,
    };
}

module.exports = {
    listSessions,
    saveSession,
};
