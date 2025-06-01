// src/sse/sse.service.ts
import { Injectable } from "@nestjs/common";
import { Subject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

interface MessageEvent {
  data: any;
}

@Injectable()
export class NotificationServerService {
  // Map from userId → array of Subjects to push SSE messages
  private clients = new Map<string, Subject<MessageEvent>[]>();

  /**
   * Register a new SSE client for the given userId.
   * Returns an Observable that emits MessageEvent and completes when client disconnects.
   */
  registerClient(userId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    const existing = this.clients.get(userId) || [];
    existing.push(subject);
    this.clients.set(userId, existing);

    // When the client unsubscribes (closes connection), remove this subject
    return subject.asObservable().pipe(
      finalize(() => {
        this.removeClient(userId, subject);
      }),
    );
  }

  /**
   * Send a payload to all SSE clients registered under the given userId.
   */
  sendToUser(userId: string, payload: any) {
    const subjects = this.clients.get(userId) || [];
    for (const subj of subjects) {
      subj.next({ data: payload });
    }
  }

  private removeClient(userId: string, subject: Subject<MessageEvent>) {
    const subjects = this.clients.get(userId);
    if (!subjects) return;
    const idx = subjects.indexOf(subject);
    if (idx >= 0) {
      subjects.splice(idx, 1);
    }
    if (subjects.length === 0) {
      this.clients.delete(userId);
    } else {
      this.clients.set(userId, subjects);
    }
  }
}
