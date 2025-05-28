import { Inject, Injectable } from "@nestjs/common";
import { AUTH_SERVER_NAME } from "./clients.constants";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { deleteAccountMessage, loginMessage, registerMessage, requestResetPasswordMessage, resetPasswordMessage, verifyAccountMessage, whoamiMessage } from "./messages.constants";
import { LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, SuccessResponse, Token, UserContextType, VerificationTokenDto, WithContext } from "@app/types";

@Injectable()
export class AuthProxyService {
    constructor(@Inject(AUTH_SERVER_NAME) private readonly proxy: ClientProxy) {}

    /**
   * Method used in order to send a register message to auth server.
   * 
   * @param {NewAccountDto} requestData register form.
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  register(requestData: NewAccountDto): Observable<SuccessResponse> {
    return this.proxy.send(registerMessage, requestData);
  }

  /**
   * Method used in order to send a login message to auth server.
   * 
   * @param {LoginAccountDto} requestData login form.
   * @returns {Observable<Token>} access token from auth server.
   */
  login(requestData: LoginAccountDto): Observable<Token> {
    return this.proxy.send(loginMessage, requestData);
  }

  /**
   * Method used in order to send a whoami message to auth server.
   * 
   * @param {Token} token user access token.
   * @returns {Observable<UserContextType>} user context.
   */
  whoami(token: Token): Observable<UserContextType> {
    return this.proxy.send(whoamiMessage, token);
  }

  /**
   * Method used in order to send a verify account message to auth server.
   * 
   * @param {VerificationTokenDto} verificationToken user account verification token.
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  verifyAccount(verificationToken: VerificationTokenDto): Observable<SuccessResponse> {
    return this.proxy.send(verifyAccountMessage, verificationToken);
  }

  /**
   * Method used in order to send a reset password request message to auth server.
   * 
   * @param {RequestResetPasswordDto} resetPasswordRequestForm user reset password request form.
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  requestResetPassword(resetPasswordRequestForm: RequestResetPasswordDto): Observable<SuccessResponse> {
    return this.proxy.send(requestResetPasswordMessage, resetPasswordRequestForm);
  }

  /**
   * Method used in order to send a reset password message to auth server.
   * 
   * @param {ResetPasswordFormDto} resetPasswordForm user reset password form.
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  resetPassword(resetPasswordForm: ResetPasswordFormDto): Observable<SuccessResponse> {
    return this.proxy.send(resetPasswordMessage, resetPasswordForm);
  }

  deleteAccount(userContext: UserContextType, id: string): Observable<SuccessResponse> {
    const payload: WithContext<any> = {
      userContext,
      data: {
        id
      }
    }

    return this.proxy.send(deleteAccountMessage, payload);
  }
}