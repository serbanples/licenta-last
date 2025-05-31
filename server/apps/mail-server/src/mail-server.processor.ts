// src/mail/mail.processor.ts
import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent, InjectQueue } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_SERVER_QUEUE } from '@app/clients';
import { MailJobData } from '@app/types';
import { LoggerService } from '@app/logger';
import { MailService } from './mail-server.service';

@Injectable()
@Processor(MAIL_SERVER_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService, private readonly logger: LoggerService) {
    super();
  }

  // This method is invoked for each job pulled from "mail-queue".
  // :contentReference[oaicite:4]{index=4}
  async process(job: Job<MailJobData>): Promise<void> {
    this.logger.log('Processing job', { jobId: job.id, sendTo: job.data.to });
    await this.mailService.sendMail(job.data);
  }

  // Event listener: called when a job has completed successfully
  @OnWorkerEvent('completed')
  onCompleted(job: Job<MailJobData>) {
   this.logger.log('Job completed', { jobId: job.id });
  }

  // Event listener: called when a job has failed (after retries if configured)
  @OnWorkerEvent('failed')
  onFailed(job: Job<MailJobData>, error: Error) {
    this.logger.error('Job failed', { jobId: job.id }, error.stack);
  }
}
