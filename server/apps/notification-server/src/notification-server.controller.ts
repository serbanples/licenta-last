// src/sse/sse.controller.ts
import { Controller, UseGuards, Req } from "@nestjs/common";
import { Sse, MessageEvent } from "@nestjs/common";
import { Observable } from "rxjs";
import { NotificationServerService } from "./notification-server.service";
import { AuthGuard } from "@app/shared";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { NotificationData } from "@app/types";
import { notificationMessage } from "@app/clients";

@Controller("sse")
export class NotificationServerController {
  constructor(private readonly notificationService: NotificationServerService) {}

  /**
   * GET /sse/stream
   * Establishes an SSE connection. JwtAuthGuard populates req.user.
   */
  @Sse("events")
  @UseGuards(AuthGuard)
  stream(@Req() req): Observable<{ data: NotificationData}> {
    const userId = req.id;
    return this.notificationService.registerClient(userId);
  }

  /**
   * Listens on the “send_notification” message pattern.
   * Expects { sendTo: string[], data: any }.
   */
  @MessagePattern(notificationMessage)
  handleNotification(@Payload() payload: NotificationData) {
    const { sendTo } = payload;
    for (const userId of sendTo) {
      this.notificationService.sendToUser(userId, payload);
    }
  }
}
