import { randomUUID } from "node:crypto";

import type { SessionTurn } from "../types/chat.js";

interface SessionRecord {
  expiresAt: number;
  lastAccessedAt: number;
  turns: SessionTurn[];
}

export class SessionStore {
  private readonly maxTurns: number;
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly ttlMs: number;

  constructor(ttlMs: number, maxTurns: number) {
    this.ttlMs = ttlMs;
    this.maxTurns = maxTurns;
  }

  createSessionId(existingSessionId?: string): string {
    return existingSessionId?.trim() || randomUUID();
  }

  getSession(sessionId: string): SessionTurn[] {
    const record = this.getRecord(sessionId);
    return record?.turns ?? [];
  }

  appendTurn(sessionId: string, turn: SessionTurn): void {
    const now = Date.now();
    const existing = this.getRecord(sessionId);
    const turns = [...(existing?.turns ?? []), turn].slice(-this.maxTurns);

    this.sessions.set(sessionId, {
      turns,
      lastAccessedAt: now,
      expiresAt: now + this.ttlMs,
    });
  }

  private getRecord(sessionId: string): SessionRecord | undefined {
    const record = this.sessions.get(sessionId);

    if (!record) {
      return undefined;
    }

    if (record.expiresAt <= Date.now()) {
      this.sessions.delete(sessionId);
      return undefined;
    }

    record.lastAccessedAt = Date.now();
    record.expiresAt = record.lastAccessedAt + this.ttlMs;
    return record;
  }
}