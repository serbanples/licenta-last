import { GET, mapToQueryParams, POST } from "./requestHandler"
import { LoginFormType, SignupFormType } from "./types";
import { LOGIN_URL, SIGNUP_URL, WHOAMI_URL, LOGOUT_URL, VERIFY_ACCOUNT_URL } from "./urls";

export const login = async (form: LoginFormType) => {
  return POST(LOGIN_URL, form)
    .then((data) => data)
    .catch(error => { throw new Error(error.message.split(',')[0])});
}

export const signup = async (form: SignupFormType) => {
  return POST(SIGNUP_URL, form)
    .then((data) => data)
    .catch(error => { throw new Error(error.message.split(',')[0])});
}

export const whoami = async () => {
  return GET(WHOAMI_URL)
    .then((data) => data)
    .catch(error => { throw new Error(error.message.split(',')[0])})
}

export const logout = async () => {
  return POST(LOGOUT_URL)
    .then(data => data)
    .catch(error => { throw new Error(error.message.split(',')[0])})
}

export const verifyAccount = async(token: string) => {
  const route = mapToQueryParams(VERIFY_ACCOUNT_URL, { verificationToken: token });
  return GET(route)
    .then(data => data)
    .catch(error => { throw new Error(error.message.split(',')[0])})
}