import { BoardService, AuthService, OrganizationService } from "./index";
import axios, { Axios } from 'axios';
import { AxiosClient } from "./axios-client";

export default class AppService {
    public boardService: BoardService;
    public authService: AuthService;
    public organizationService: OrganizationService;
    private axios: Axios;

    constructor() {
        this.axios = new AxiosClient().axios;
        this.boardService = new BoardService(axios);
        this.authService = new AuthService(axios);
        this.organizationService = new OrganizationService(axios);
    }
}