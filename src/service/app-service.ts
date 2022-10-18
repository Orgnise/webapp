import { BoardService } from "./board-service";
import axios, { Axios } from 'axios';
import { AxiosClient } from "./axios-client";

export default class AppService {
    public boardService: BoardService;
    private axios: Axios;

    constructor() {
        this.axios = new AxiosClient().axios;
        this.boardService = new BoardService(axios);
    }
}