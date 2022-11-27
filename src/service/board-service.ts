import { Axios } from 'axios';
import { AxiosClient } from "./axios-client";
import { Endpoints } from "../constant/constants";

export default class BoardService {
    private client: Axios;

    constructor(axios: Axios) {
        this.client = axios;
    }

    async getBoard() {
        return this.client
            .get(Endpoints.board.get)
            .then((response) => response.data);
    }
}