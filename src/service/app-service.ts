import { AuthService, OrganizationService, WorkspaceService } from "./index";
import axios, { Axios } from 'axios';
import { AxiosClient } from "./axios-client";

export default class AppService {
    private axios: Axios;
    public authService: AuthService;
    public workspaceService: WorkspaceService;
    public teamService: OrganizationService;

    constructor() {
        this.axios = new AxiosClient().axios;
        this.authService = new AuthService(this.axios);
        this.workspaceService = new WorkspaceService(this.axios);
        this.teamService = new OrganizationService(this.axios);
    }
}