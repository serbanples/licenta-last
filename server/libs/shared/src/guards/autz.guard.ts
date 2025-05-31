import { AutzProxyService } from "@app/clients/autzProxy.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { catchError, Observable, tap } from "rxjs";
import { AUTHORIZE_KEY } from "../decorators/autorization.decorator";
import { AuthorizeDataType, WithContext } from "@app/types";

@Injectable()
export class AutzGuard implements CanActivate {
    constructor(
        private readonly autzClient: AutzProxyService,
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const message = this.reflector.getAllAndOverride<AuthorizeDataType>(AUTHORIZE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const payloadData: WithContext<any> = context.switchToRpc().getData();

        return this.autzClient.authorize({ ...message, userRole: payloadData.userContext.role }).pipe(
            tap((data) => {
                if(!data) throw new UnauthorizedException('Not authorized for this action');
                return true;
            }),
            catchError(() => { throw new UnauthorizedException('Not authorized for this action') })
        );
    }
}