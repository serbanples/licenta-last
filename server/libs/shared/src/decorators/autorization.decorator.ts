import { SetMetadata } from "@nestjs/common";

export const AUTHORIZE_KEY = 'authorize';
export const Authorize = (method: string, resource: string) => SetMetadata(AUTHORIZE_KEY, { method, resource });