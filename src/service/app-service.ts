import { BoardService, AuthService, OrganizationService, ProjectService } from "./index";
import axios, { Axios } from 'axios';
import { AxiosClient } from "./axios-client";

export default class AppService {
    private axios: Axios;
    public authService: AuthService;
    public boardService: BoardService;
    public projectService: ProjectService;
    public organizationService: OrganizationService;

    constructor() {
        this.axios = new AxiosClient().axios;
        this.authService = new AuthService(axios);
        this.boardService = new BoardService(axios);
        this.projectService = new ProjectService(axios);
        this.organizationService = new OrganizationService(axios);
    }
}