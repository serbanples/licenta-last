import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const LOG_METADATA = 'log-metadata';
export const LogMetadata = (metadata: Record<string, any>): CustomDecorator => SetMetadata(LOG_METADATA, metadata);