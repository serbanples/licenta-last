import { LoggerService } from '@app/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Logger Middleware class used to log http requests and responses
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Middleware function that intercepts requests and responses and logs data from them.
   * 
   * @param {Request} req incoming request.
   * @param {Response} res outgoint response.
   * @param {NextFunction} next express next function.
   * @returns {void} logs request/response data.
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body } = req;

    this.logger.log('HTTP Request', {
      type: 'request',
      body,
      method,
      url: originalUrl,
      timestamp: new Date().toISOString(),
    });

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log('HTTP Response', {
        type: 'response',
        method,
        url: originalUrl,
        statusCode,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
