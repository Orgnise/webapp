import { Axios } from 'axios';
import { AxiosClient } from "./axios-client";
import { Endpoints } from "../constant/constants";


export class AuthService {
    private client: Axios;

    constructor(axios: Axios) {
        this.client = axios;
    }

    async register({ name, email, password, confirmPassword, role = "User" }: { name: string, email: string, password: string, confirmPassword: string, role: string }) {
        return this.client
            .post(Endpoints.auth.register, {
                name,
                email,
                password,
                confirmPassword,
                role
            })
            .then((response) => response.data);
    }
}