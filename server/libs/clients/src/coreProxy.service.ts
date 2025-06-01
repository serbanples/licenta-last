import { Inject, Injectable } from "@nestjs/common";
import { CORE_SERVER_NAME } from "./clients.constants";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class CoreProxyService {
    constructor(@Inject(CORE_SERVER_NAME) private readonly proxy: ClientProxy) {}
}