import { Axios } from 'axios';
import { AxiosClient } from "./axios-client";
import { Endpoints } from "../constant/constants";

export default class OrganizationService {
    private client: Axios;

    constructor(axios: Axios) {
        this.client = axios;
    }

    async getAllCompanies() {
        return this.client
            .get(Endpoints.organization.getAll)
            .then((response) => response.data);
    }

    /**
     * Get company by id
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getCompanyById(id: string) {
        return this.client
            .get(Endpoints.organization.getById(id))
            .then((response) => response.data);
    }
}