// src/sse/sse.service.ts
import { NotificationModel } from "@app/dbacc";
import { NotificationData, NotificationTopicEnum } from "@app/types";
import { Injectable } from "@nestjs/common";
import { Subject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Injectable()
export class NotificationServerService {
  // Map from userId → array of Subjects to push SSE messages
  private clients = new Map<string, Subject<{ data: NotificationData}>[]>();

  constructor(private readonly notificationModel: NotificationModel) {}

  /**
   * Register a new SSE client for the given userId.
   * Returns an Observable that emits MessageEvent and completes when client disconnects.
   */
  registerClient(userId: string): Observable<{ data: NotificationData}> {
    const subject = new Subject<{ data: NotificationData}>();
    const existing = this.clients.get(userId) || [];
    existing.push(subject);
    console.log(existing)
    this.clients.set(userId, existing);
    console.log(this.clients);

    // setInterval(() => {
    //   // console.log('sending')
    //   subject.next({ data: { topic: NotificationTopicEnum.NOTIFICATION, sendTo: [userId], data: 'bubu'} })
    // }, 2000);

    // When the client unsubscribes (closes connection), remove this subject
    return subject.asObservable().pipe();
  }

  /**
   * Send a payload to all SSE clients registered under the given userId.
   */
  sendToUser(userId: string, payload: NotificationData) {
    this.saveNotification(payload)
    console.log(this.clients);
    const subjects = this.clients.get(userId) || [];
    console.log(subjects);
    for (const subj of subjects) {
      console.log(payload)
      subj.next({ data: payload});
    }
  }

  private removeClient(userId: string, subject: Subject<NotificationData>) {
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

  private saveNotification(notification: NotificationData) {
    if(notification.topic !== NotificationTopicEnum.NOTIFICATION) return;
    this.notificationModel.create(notification);
  }
}
