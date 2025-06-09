// src/sse/sse.controller.ts
import { Controller, UseGuards, Req } from "@nestjs/common";
import { Sse, MessageEvent } from "@nestjs/common";
import { Observable } from "rxjs";
import { NotificationServerService } from "./notification-server.service";
import { AuthGuard, UserContext } from "@app/shared";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { NotificationData, UserContextType } from "@app/types";
import { notificationMessage } from "@app/clients";

@Controller()
export class NotificationServerController {
  constructor(private readonly notificationService: NotificationServerService) {}

  /**
   * GET /sse/stream
   * Establishes an SSE connection. JwtAuthGuard populates req.user.
   */
  @Sse("sse/events")
  @UseGuards(AuthGuard)
  stream(@Req() req, @UserContext() user: UserContextType): Observable<{ data: NotificationData}> {
    const userId = user.id;
    return this.notificationService.registerClient(userId);
  }

  /**
   * Listens on the “send_notification” message pattern.
   * Expects { sendTo: string[], data: any }.
   */
  @MessagePattern(notificationMessage)
  handleNotification(@Payload() payload: NotificationData) {
    console.log(payload)
    const { sendTo } = payload;
    for (const userId of sendTo) {
      console.log(userId)
      this.notificationService.sendToUser(userId, payload);
    }
  }
}
