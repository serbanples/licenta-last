import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { SuccessResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, Token, UserContextType, VerificationTokenDto, WithContext } from '@app/types';
import { LoggerInterceptor, RpcErrorEncoder, Authorize } from '@app/shared';
import { deleteAccountMessage, loginMessage, registerMessage, requestResetPasswordMessage, resetPasswordMessage, verifyAccountMessage, whoamiMessage } from '@app/clients';

/**
 * Auth controller class used to handle incoming messages for authentication
 */
@UseInterceptors(LoggerInterceptor)
@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @MessagePattern(registerMessage)
  @RpcErrorEncoder()
  createAccount(@Payload() newAccount: NewAccountDto): Promise<SuccessResponse> {
    return this.authService.createAccount(newAccount);
  }

  @MessagePattern(loginMessage)
  @RpcErrorEncoder()
  generateToken(@Payload() loginAccount: LoginAccountDto): Promise<Token> {
    return this.authService.login(loginAccount);
  }

  @MessagePattern(whoamiMessage)
  @RpcErrorEncoder()
  validateToken(@Payload() token: Token): Promise<UserContextType> {
    return this.authService.whoami(token);
  }

  @MessagePattern(verifyAccountMessage)
  @RpcErrorEncoder()
  verifyAccount(@Payload() verificationToken: VerificationTokenDto): Promise<SuccessResponse> {
    return this.authService.verifyAccount(verificationToken);
  }

  @MessagePattern(requestResetPasswordMessage)
  @RpcErrorEncoder()
  requestResetPassword(@Payload() resetPasswordRequestForm: RequestResetPasswordDto): Promise<SuccessResponse> {
    return this.authService.requestResetPassword(resetPasswordRequestForm);
  }

  @MessagePattern(resetPasswordMessage)
  @RpcErrorEncoder()
  resetPassword(@Payload() resetPasswordForm: ResetPasswordFormDto): Promise<SuccessResponse> {
    return this.authService.resetPassword(resetPasswordForm);
  }

  @MessagePattern(deleteAccountMessage)
  @Authorize('delete', 'account')
  @RpcErrorEncoder()
  deleteAccount(@Payload() data: WithContext<AccountDeleteType>): Promise<SuccessResponse> {
    return this.authService.deleteAccount(data.userContext, data.data.id);
  }
}
