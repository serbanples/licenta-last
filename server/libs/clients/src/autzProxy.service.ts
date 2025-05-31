import { Inject, Injectable } from "@nestjs/common";
import { AUTZ_SERVER_NAME } from "./clients.constants";
import { ClientProxy } from "@nestjs/microservices";
import { AuthorizeDataType, UserRoleEnum } from "@app/types";
import { authorizeMessage } from "./messages.constants";
import { Observable } from "rxjs";

@Injectable()
export class AutzProxyService {
    constructor(@Inject(AUTZ_SERVER_NAME) private readonly proxy: ClientProxy) {}

    authorize(message: AuthorizeDataType & { userRole: UserRoleEnum }): Observable<boolean> {
        return this.proxy.send(authorizeMessage, message);
    }
}