import axios, { Axios } from 'axios';
import { Endpoints } from '../constant/constants';


export class AxiosClient {

    public constructor() {
        this.axios = axios.create({
            baseURL: Endpoints.baseUrl,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.addInterceptor();
    }


    /**
     * axios instance
     */
    public axios: Axios;

    private addInterceptor() {
        this.axios.interceptors.request.use(function (config) {
            // Add x-access-token to header
            const user = localStorage.getItem('user');
            if (config.url !== '/login' && config.url !== '/register' && user) {
                if (config && config.headers) {
                    const token = JSON.parse(user).jwtToken;
                    config.headers.Authorization = `Bearer ${token}`;
                }
                config.baseURL = Endpoints.baseUrl;
            }

            return config;
        }, function (error) {
            console.log("🚀 ~ file: client.ts ~ line 58 ~ Client ~ error", error)
            return Promise.reject(error);
        });

    }
}