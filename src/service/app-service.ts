import { BoardService } from "./board-service";
import axios, { Axios } from 'axios';
import { AxiosClient } from "./axios-client";
import { AuthService } from "./auth-service";

export default class AppService {
    public boardService: BoardService;
    public authService: AuthService;
    private axios: Axios;

    constructor() {
        this.axios = new AxiosClient().axios;
        this.boardService = new BoardService(axios);
        this.authService = new AuthService(axios);
    }
}