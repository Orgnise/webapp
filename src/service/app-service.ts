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
        this.authService = new AuthService(this.axios);
        this.boardService = new BoardService(this.axios);
        this.projectService = new ProjectService(this.axios);
        this.organizationService = new OrganizationService(this.axios);
    }
}