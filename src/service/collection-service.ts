import { Axios, AxiosResponse } from 'axios';
import { Endpoints } from "../constant/constants";

export default class CollectionService {
    private client: Axios;

    constructor(axios: Axios) {
        this.client = axios;
    }

    /** 
     * Create collection/item
     * @param {Object} data - collection/item data. workspaceId is required to create collection. parent is required to create item
     * @param {String} data.workspaceId - workspace id
     * @param {String} data.parent - parent collection id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async createCollection(data: any): Promise<AxiosResponse<any>> {
        return this.client
            .post(Endpoints.collection.create, data)
            .then((response) => response.data);
    }


    /**
     * Get team all teams
     * @param {Object} filter - filter object {id, teamId, parent, workspaceId}
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getAllCollection({ workspaceId, teamId, parent, object, limit, query, }: { teamId: String | undefined, parent: String | undefined, workspaceId: String, object: String | undefined, limit: String | undefined, query: String | undefined, }): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.collection.getAll({ teamId, parent, workspaceId, object, limit, query }))
            .then((response) => response.data);
    }

    /**
     * Get collection/item by id
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getCollectionById(id: string): Promise<AxiosResponse<any>> {
        return this.client
            .get(Endpoints.collection.getCollectionById(id))
            .then((response) => response.data);
    }

    /**
     * Update collection/item
     * @param {Object} data
     * @returns {Promise<AxiosResponse<any>>}
     */
    async updateCollection(id: string, data: any): Promise<AxiosResponse<any>> {
        return this.client
            .put(Endpoints.collection.update(id), data)
            .then((response) => response.data);
    }

    /**
     * Delete collection/item
     * @param {String} id - collection/item id
     * @returns {Promise<AxiosResponse<any>>}
     */
    async deleteCollection(id: String): Promise<AxiosResponse<any>> {
        return this.client
            .delete(Endpoints.collection.delete(id))
            .then((response) => response.data);
    }
}