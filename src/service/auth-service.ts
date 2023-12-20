import { Axios } from "axios";
import { Endpoints } from "../constant/constants";

export default class AuthService {
  private client: Axios;

  constructor(axios: Axios) {
    this.client = axios;
  }

  /**
   * Register a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof AuthService
   * @throws {AxiosError}
   */
  async register({
    name,
    email,
    password,
    confirmPassword,
    role = "User",
  }: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) {
    return this.client
      .post(Endpoints.auth.register, {
        name,
        email,
        password,
        confirmPassword,
        role,
      })
      .then((response) => response.data);
  }

  /**
   * Authenticate a user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof AuthService
   * @throws {AxiosError}
   */
  async login({ email, password }: { email: string; password: string }) {
    return this.client
      .post(Endpoints.auth.login, {
        email,
        password,
      })
      .then((response) => response.data);
  }

  /**
   * Login with google
   * @param {any} accessToken
   * @returns {Promise<any>}
   * @memberof AuthService
   * @throws {AxiosError}
   */
  async loginWithGoogle(accessToken: string): Promise<any> {
    return this.client
      .post(Endpoints.auth.loginWithGoogle, { accessToken: accessToken })
      .then((response) => response.data);
  }
}
