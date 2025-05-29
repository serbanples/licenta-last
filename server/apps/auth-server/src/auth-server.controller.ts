import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { SuccessResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, Token, UserContextType, VerificationTokenDto, WithContext } from '@app/types';
import { LoggerInterceptor, RpcErrorEncoder, Authorize } from '@app/shared';
import { deleteAccountMessage, loginMessage, registerMessage, requestResetPasswordMessage, resetPasswordMessage, verifyAccountMessage, whoamiMessage } from '@app/clients';
import { AuthServerService } from './services/auth-server.service';

/**
 * Auth controller class used to handle incoming messages for authentication
 */
@UseInterceptors(LoggerInterceptor)
@Controller()
export class AuthServerController {
  constructor(private readonly service: AuthServerService) {}

  @MessagePattern(registerMessage)
  @RpcErrorEncoder()
  createAccount(@Payload() newAccount: NewAccountDto): Promise<SuccessResponse> {
    return this.service.createAccount(newAccount);
  }

  @MessagePattern(loginMessage)
  @RpcErrorEncoder()
  generateToken(@Payload() loginAccount: LoginAccountDto): Promise<Token> {
    return this.service.login(loginAccount);
  }

  @MessagePattern(whoamiMessage)
  @RpcErrorEncoder()
  validateToken(@Payload() token: Token): Promise<UserContextType> {
    return this.service.whoami(token);
  }

  @MessagePattern(verifyAccountMessage)
  @RpcErrorEncoder()
  verifyAccount(@Payload() verificationToken: VerificationTokenDto): Promise<SuccessResponse> {
    return this.service.verifyAccount(verificationToken);
  }

  @MessagePattern(requestResetPasswordMessage)
  @RpcErrorEncoder()
  requestResetPassword(@Payload() resetPasswordRequestForm: RequestResetPasswordDto): Promise<SuccessResponse> {
    return this.service.requestResetPassword(resetPasswordRequestForm);
  }

  @MessagePattern(resetPasswordMessage)
  @RpcErrorEncoder()
  resetPassword(@Payload() resetPasswordForm: ResetPasswordFormDto): Promise<SuccessResponse> {
    return this.service.resetPassword(resetPasswordForm);
  }

  // @MessagePattern(deleteAccountMessage)
  // @Authorize('delete', 'account')
  // @RpcErrorEncoder()
  // deleteAccount(@Payload() data: WithContext<AccountDeleteType>): Promise<SuccessResponse> {
  //   return this.service.deleteAccount(data.userContext, data.data.id);
  // }
}
