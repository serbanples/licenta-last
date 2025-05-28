import { Response } from "express"

export const setCookie = (response: Response, token: string): void => {
    response.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
    })
}

export const clearCookie = (response: Response): void => {
    response.clearCookie('accessToken');
}