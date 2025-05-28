import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '@app/logger';
import { LOG_METADATA } from './logger.metadata';
import _ from 'lodash';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Logging interceptor class used for rabbitMQ messages.
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService, private readonly reflector: Reflector) {}

  /**
   * Intercepts the message and logs it.
   * 
   * @param {ExecutionContext} context execution context.
   * @param {CallHandler} next next handler.
   * @returns {Observable<any>} response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpc = context.switchToRpc();
    const data = rpc.getData();
    const pattern = rpc.getContext().getPattern();

    const handlerName = context.getHandler().name;

    const metadata = this.reflector.get(LOG_METADATA, context.getHandler());

    this.logger.log('RabbitMQ Message Received', {
      event: 'rabbitmq_message_received',
      pattern,
      method: handlerName,
      messageData: this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      ...metadata,
    });

    return next.handle().pipe(
      tap({
        next: (response) => {
          this.logger.log('RabbitMQ Message Sent', {
            event: 'rabbitmq_message_sent',
            pattern,
            method: handlerName,
            messageData: this.sanitizeData(response),
            timestamp: new Date().toISOString(),
            ...metadata,
          });
        },
        error: (error) => {
          this.logger.error('RabbitMQ Message Error', {
            event: 'rabbitmq_message_error',
            pattern,
            method: handlerName,
            error: error.message,
            timestamp: new Date().toISOString(),
            ...metadata,
          });
        }
      })
    );
  }

  private sanitizeData(data: any): any {
    if (_.isNil(data)) {
      return data;
    }

    const sanitized = { ...data };

    const sensitiveFields = ['password', 'token', 'secret', 'confirmedPassword', 'access_token'];
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}