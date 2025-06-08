import { randomUUID } from 'crypto';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { CORE_SERVER_NAME, MailClient } from '@app/clients';
import { LoginAccountDto, MailTypeEnum, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, SuccessResponse, Token, UserContextType, UserRoleEnum, VerificationTokenDto, WithContext } from '@app/types';
import { ConfService } from '@app/conf';
import { AccountModel, AccountType, UserType } from '@app/dbacc';
import { CoreProxyService } from '@app/clients/coreProxy.service';
import { UserCreateType, UserDeleteType } from '@app/types/types/user';

/**
 * Auth service class.
 */
@Injectable()
export class AuthServerService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly model: AccountModel,
    private readonly jwtService: JwtService,
    private readonly config: ConfService,
    private readonly mailClient: MailClient,
    private readonly coreProxy: CoreProxyService
  ) {
  }

  async createAccount(newAccount: NewAccountDto): Promise<SuccessResponse> {
    return this.model.findOne({ email: newAccount.email })
      .then((user) => {
        if (!_.isNil(user)) {
          throw new BadRequestException('User already exists');
        }
        return this.hashPassword(newAccount.password);
      })
      .then((hashedPassword) => {
        const verificationToken = this.generateVerificationToken();

        const user: Partial<AccountType> = {
          email: newAccount.email,
          fullName: newAccount.fullName,
          password: hashedPassword,
          accountVerificationToken: verificationToken,
          verificationTokenExipration: Date.now() + this.config.getOrDefault<number>('token.expiration'),
        }

        console.log(user.verificationTokenExipration)
        console.log(Date.now)

        return this.model.create(user);
      })
      .then((account) => {
        this.sendVerificationEmail(newAccount.email, account.accountVerificationToken);

        return { success: true }
      })
  }

  async login(loginAccount: LoginAccountDto): Promise<Token> {
    return this.model.findOneWithPassword({ email: loginAccount.email })
      .then((user) => {
        if (_.isNil(user)) {
          throw new NotFoundException('User not found!')
        }
        return this.compareHash(loginAccount.password, user.password)
          .then((passwordsEqual) => {
            if (!passwordsEqual) {
              throw new BadRequestException('Incorrect password.');
            }

            if (user.isVerified === false) {
              throw new UnauthorizedException('Account is not verified!');
            }

            return this.generateToken(user);
          });
      })
      .then((token) => {
        return { accessToken: token };
      })
  }

  async whoami(token: Token): Promise<UserContextType> {
    return this.verifyToken(token.accessToken);
  }

  /**
   * Method used to register an account as verified.
   * 
   * @param {string} token verification token sent by the user. 
   * @returns {Promise<SuccessResponse>} true if success, error if not.
   */
  async verifyAccount(token: VerificationTokenDto): Promise<SuccessResponse> {
    console.log(token)
    return this.model.findOne({ accountVerificationToken: token.verificationToken })
      .then((account) => {
        if (_.isNil(account)) {
          throw new NotFoundException('Invalid verification token!');
        }
        if (account.verificationTokenExipration < Date.now()) {
          throw new BadRequestException('Token expired!');
        }
        return this.model.updateOne({ accountVerificationToken: token.verificationToken }, { isVerified: true })
      })
      .then(async (account) => {
        if (_.isNil(account)) {
          throw new NotFoundException('Invalid verification token!')
        }

        const user = await this.sendUserCreatedEventToCore(account);
        this.model.updateOne({ _id: account.id }, { userId: user.id });

        return { success: true };
      })
  }

  /**
   * Method used to request a password reset.
   * 
   * @param {RequestResetPasswordDto} form reset request form sent by user.
   * @returns {Promise<SuccessResponse>} true if success, error if not.
   */
  async requestResetPassword(form: RequestResetPasswordDto): Promise<SuccessResponse> {
    return this.model.findOne({ email: form.email })
      .then((account) => {
        if (_.isNil(account)) {
          throw new NotFoundException('User not found');
        }

        return this.generateVerificationToken();
      })
      .then((resetToken) => {
        const resetTokenExpiration = Date.now() + this.config.getOrDefault<number>('token.exipration');
        return this.model.updateOne({ email: form.email }, { passwordResetToken: resetToken, resetTokenExpiration });
      })
      .then((updatedAccount) => {
        if (_.isNil(updatedAccount)) {
          throw new NotFoundException('User not found');
        }
        this.sendResetPasswordEmail(updatedAccount.email, updatedAccount.passwordResetToken);

        return { success: true };
      })
  }

  /**
   * Method used to reset a user password.
   * 
   * @param {ResetPasswordFormDto} form reset password form with new password and reset token.
   * @returns {Promise<SuccessResponse>} true if success, error if not.
   */
  async resetPassword(form: ResetPasswordFormDto): Promise<SuccessResponse> {
    return this.model.findOne({ passwordResetToken: form.resetToken })
      .then(async (account) => {
        if (_.isNil(account)) {
          throw new NotFoundException('Account not found');
        }
        if (account.resetTokenExpiration > Date.now()) {
          throw new BadRequestException('Token expired');
        }

        const hashedPassword = await this.hashPassword(form.password);
        return this.model.updateOne({ _id: account.id }, { password: hashedPassword })
      })
      .then((account) => {
        if (_.isNil(account)) {
          throw new NotFoundException('User not found');
        }

        return { success: true };
      })
  }

  async deleteAccount(userContext: UserContextType, id: string): Promise<SuccessResponse> {
    if (userContext.role !== UserRoleEnum.MASTER && userContext.id !== id) {
      throw new ForbiddenException('Cannot delete this account!');
    }
    return this.model.findOne({ _id: id })
      .then((account) => {
        if (_.isNil(account)) {
          throw new NotFoundException('Account not found!');
        }

        return this.model.deleteOne({ _id: id })
          .then((result) => {
            if (result.acknowledged) {
              this.sendUserDeletedEventToCore(account.id);
              return { success: true };
            }

            return { success: false };
          })
      })
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private compareHash(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async generateToken(userData: AccountType): Promise<string> {
    const payload = { id: userData.id, email: userData.email, role: userData.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return this.model.updateOne({ _id: userData.id }, { accessToken })
      .then(user => user!.accessToken);
  }

  private generateVerificationToken(): string {
    return randomUUID().toString();
  }

  private async verifyToken(token: string): Promise<UserContextType> {
    return this.jwtService.verifyAsync(token)
      .then((decodedToken) =>
        this.model.findOne({ _id: decodedToken['id'], email: decodedToken['email'], role: decodedToken['role'], accessToken: token }))
      .then(user => {
        if (_.isNil(user)) {
          throw new UnauthorizedException('Invalid user data!');
        }
        return {
          id: user.userId,
          email: user.email,
          role: user.role
        }
      })
  }

  private sendVerificationEmail(email: string, verificationToken: string): void {
    this.mailClient.send({ to: email, subject: '', mailType: MailTypeEnum.VERIFY_ACCOUNT, payload: { verificationToken }})
  }

  private sendResetPasswordEmail(email: string, resetToken: string): void {
    this.mailClient.send({ to: email, subject: '', mailType: MailTypeEnum.RESET_PASSWORD, payload: { resetToken }})
  }

  private sendUserCreatedEventToCore(accountData: AccountType): Promise<UserType> {
    const payload: WithContext<UserCreateType> = {
      userContext: {
        id: 'master',
        email: 'master',
        role: UserRoleEnum.MASTER
      },
      data: {
        email: accountData.email,
        fullName: accountData.fullName,
        accountId: accountData.id,
      }
    }

    return firstValueFrom(this.coreProxy.createUser(payload));
  }

  private sendUserDeletedEventToCore(accountEmail: string): void {
    const payload: WithContext<UserDeleteType> = {
      userContext: {
        id: 'master',
        email: 'master',
        role: UserRoleEnum.MASTER
      },
      data: {
        id: accountEmail,
      }
    }
    this.coreProxy.deleteUser(payload);
  }
}
