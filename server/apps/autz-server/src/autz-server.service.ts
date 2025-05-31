import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@app/logger';
import { UserRoleEnum } from '@app/types';
import * as authConfig from './rules/authorization.json';

interface AuthConfig {
  [role: string]: {
    [resource: string]: {
      [action: string]: boolean;
    };
  };
}

/**
 * Authorization Service class.
 */
@Injectable()
export class AutzServerService {
  private readonly authConfig: AuthConfig;
  private readonly logger: LoggerService;

  /**
   * Constructor method.
   * 
   * @param {LoggerService} logger logger instance to be used by authorization service.
   */
  constructor(logger: LoggerService) {
    this.authConfig = authConfig as AuthConfig;
    this.logger = logger;
  }

  /**
   * Method used to check if a user is authorized to access a resource.
   * 
   * @param {UserRoleEnum} role role of the user.
   * @param {string} resource resource accessed.
   * @param {string} action method called.
   * @returns {boolean} true if user is authorized, false if not.
   */
  isAuthorized(role: UserRoleEnum, resource: string, action: string): boolean {
    if (!this.authConfig[role]) {
      this.logAuthzCheck(role, resource, action, false, 'Role not found');
      return false;
    }

    if (!this.authConfig[role][resource]) {
      this.logAuthzCheck(role, resource, action, false, 'Resource not found for role');
      return false;
    }

    if (typeof this.authConfig[role][resource][action] !== 'boolean') {
      this.logAuthzCheck(role, resource, action, false, 'Action not found for resource');
      return false;
    }

    const isAllowed = this.authConfig[role][resource][action];
    this.logAuthzCheck(role, resource, action, isAllowed);

    return isAllowed;
  }

  /**
   * Method used to log authorization check result.
   * 
   * @param {string} role user role.
   * @param {string} resource resource accessed.
   * @param {string} action method called.
   * @param {boolean} result auhtorization result
   * @param {string} reason error message.
   * @returns {void} logs authorizationr result.
   */
  private logAuthzCheck(role: string, resource: string, action: string, result: boolean, reason?: string): void {
    this.logger.log('Authorization check', {
      event: 'authorization_check',
      role,
      resource,
      action,
      result: result ? 'allowed' : 'denied',
      ...(_.isNil(reason) && { reason }),
      timestamp: new Date().toISOString()
    });
  }
}