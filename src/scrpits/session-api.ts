export interface SessionRecord {
    id: number;
    name: string;
    durationSeconds: number;
    completedAt: string;
}

interface SessionListResponse {
    sessions: SessionRecord[];
}

interface SessionCreateResponse {
    session: SessionRecord;
}

export class SessionApi {
    async listSessions(): Promise<SessionRecord[]> {
        const response = await fetch("/api/sessions");

        if (!response.ok) {
            throw new Error("Failed to load saved sessions.");
        }

        const payload = await response.json() as SessionListResponse;
        return payload.sessions;
    }

    async saveSession(name: string, durationSeconds: number): Promise<SessionRecord> {
        const response = await fetch("/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, durationSeconds }),
        });

        if (!response.ok) {
            throw new Error("Failed to save session.");
        }

        const payload = await response.json() as SessionCreateResponse;
        return payload.session;
    }
}
