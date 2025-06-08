import * as _ from 'lodash';
import { catchError, map, Observable, of } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProxyService } from '@app/clients';
import { RequestWrapper } from '@app/types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

/**
 * Auth guard class used to authenticate users on protected routes.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructor method.
   */
  constructor(
    private readonly authClient: AuthProxyService,
    private readonly reflector: Reflector
  ) {}

  /**
   * Method used to extract the cookies and validate the request.
   * 
   * @param {ExecutionContext} context execution context.
   * @returns {Observable<boolean>} true if user is authenticated, error if not.
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return of(true);

    const request: RequestWrapper = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    console.log(request.headers)
    console.log(request.cookies)

    if (_.isNil(token)) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authClient.whoami({ accessToken: token }).pipe(
      map((userContext) => {
        request.user = userContext;
        return true;
      }),
      catchError(() => {
        throw new UnauthorizedException('Invalid token');
      })
    );
  }

  /**
   * Method used to extract the token from the request.
   * 
   * @param {RequestWrapper} request request object.
   * @returns {string} token.
   */
  private extractToken(request: RequestWrapper): string | undefined {
    const accessToken = request.headers.cookie?.split('=')[1];

    return accessToken;
  }
}
