import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoggerInterceptor, RpcErrorEncoder } from '@app/shared';
import { AutzServerService } from './autz-server.service';
import { authorizeMessage } from '@app/clients';
import { AuthorizeDataType, UserRoleEnum } from '@app/types';

type WITH_ROLE = { userRole: UserRoleEnum }

/** 
 * Authorization controller class.
 */
@UseInterceptors(LoggerInterceptor)
@Controller()
export class AutzServerController {
  constructor(private readonly autzService: AutzServerService) { }

  @MessagePattern(authorizeMessage)
  @RpcErrorEncoder()
  authorize(@Payload() data: AuthorizeDataType & WITH_ROLE): boolean {
    return this.autzService.isAuthorized(data.userRole, data.resource, data.method);
  }
}
