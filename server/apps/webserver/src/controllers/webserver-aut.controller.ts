import { AuthProxyService } from "@app/clients";
import { clearCookie, Public, setCookie, UserContext } from "@app/shared";
import { LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, SuccessResponse, UserContextType, VerificationTokenDto } from "@app/types";
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res } from "@nestjs/common";
import { Response } from "express";
import * as _ from "lodash";
import { map, Observable } from "rxjs";

@Controller('auth')
export class WebserverAuthController {
    constructor(private readonly proxy: AuthProxyService) { }

    @Public()
    @Post('register')
    register(@Body() registerData: NewAccountDto): Observable<SuccessResponse> {
        return this.proxy.register(registerData);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginData: LoginAccountDto, @Res({ passthrough: true }) response: Response): Observable<SuccessResponse> {
        return this.proxy.login(loginData)
            .pipe(
                map((token) => {
                    setCookie(response, token.accessToken);
                    return { success: true };
                })
            );
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response): SuccessResponse {
        clearCookie(response);
        return { success: true }
    }

    @HttpCode(HttpStatus.OK)
    @Get('whoami')
    whoami(@UserContext() user: UserContextType): UserContextType {
        return user;
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('verifyaccount')
    verifyAccount(@Query() verificationToken: VerificationTokenDto): Observable<SuccessResponse> {
        return this.proxy.verifyAccount(verificationToken);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('request-reset-password')
    requestResetPassword(@Body() requestResetPassword: RequestResetPasswordDto): Observable<SuccessResponse> {
        return this.proxy.requestResetPassword(requestResetPassword);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    resetPassword(@Body() resetPasswordForm: ResetPasswordFormDto): Observable<SuccessResponse> {
        return this.proxy.resetPassword(resetPasswordForm);
    }

    @HttpCode(HttpStatus.OK)
    @Get('delete-account')
    deleteAccount(@UserContext() user: UserContextType, @Query() id: string): Observable<SuccessResponse> {
        return this.proxy.deleteAccount(user, id);
    }
}