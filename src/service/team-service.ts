import { Axios, AxiosResponse } from 'axios';
import { Endpoints } from "../constant/constants";

export default class TeamService {
    private client: Axios;

    constructor(axios: Axios) {
        this.client = axios;
    }

    /**
     * Get team all teams
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getAllTeams(): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.team.getAll)
            .then((response) => response.data);
    }

    /**
     * Get team by id
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getOrganizationById(id: string): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.team.getById(id))
            .then((response) => response.data);
    }

    /**
     * Get team by slug
     * @param slug
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getOrganizationBySlug(slug: string): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.team.getBySlug(slug))
            .then((response) => response.data);
    }
}