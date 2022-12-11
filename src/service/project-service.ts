import { Axios, AxiosResponse } from 'axios';
import { Endpoints } from "../constant/constants";

export default class ProjectService {
    private client: Axios;

    constructor(axios: Axios) {
        this.client = axios;
    }

    /**
     * Get all projects of a organization
     * @param orgId - organization id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getAllProjects(orgId: string): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.organization.project(orgId).getAll)
            .then((response) => response.data);
    }

    /**
     * Get organization by id
     * @param id
     * @param {string} orgId
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getProjectById(orgId: string, id: string): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.organization.project(orgId).getById(id))
            .then((response) => response.data);
    }

    /**`
     * Create a new project
     * @param {string} orgId - organization id
     * @param {Object} payload - project payload. Example: { name: 'Project 1', description: 'Project 1 description' }
     * @returns {Promise<AxiosResponse<any>>}
     */
    async createProject(orgId: string, payload: any): Promise<AxiosResponse<any>> {
        return this.client
            .post(Endpoints.organization.project(orgId).create, payload)
            .then((response) => response.data);
    }

    /**
     * Add example projects to organization
     * @param {string} orgId - organization id
     * @param {Object} payload - project payload. Example: { 'examples': ['project1', 'project2'] }
     * @returns {Promise<AxiosResponse<any>>}
     */
    async addExampleProjects(orgId: string, payload: any): Promise<AxiosResponse<any>> {
        return this.client
            .post(Endpoints.organization.project(orgId).addExampleProjects, payload)
            .then((response) => response.data);
    }
}