import { Axios, AxiosResponse } from "axios";
import { Endpoints } from "../constant/constants";

export default class WorkspaceService {
  private client: Axios;

  constructor(axios: Axios) {
    this.client = axios;
  }

  /**
   * Get all workspaces of a team
   * @param orgId - team id
   * @returns {Promise<AxiosResponse<any>>}
   */
  async getAllWorkspace(orgId: string): Promise<AxiosResponse<any>> {
    return this.client
      .get(Endpoints.team.workspace(orgId).getAll)
      .then((response) => response.data);
  }

  /**
   * Get all workspaces of a team using team slug
   */
  async getAllWorkspaceBySlug(slug: string): Promise<AxiosResponse<any>> {
    return this.client

      .get(Endpoints.team.workspaceBySlug(slug).getAll)
      .then((response) => response.data);
  }

  /**
   * Get workspace by id workspace id
   * @param id
   * @param {string} orgId
   * @returns {Promise<AxiosResponse<any>>}
   */
  async getWorkspaceById(
    orgId: string,
    id: string
  ): Promise<AxiosResponse<any>> {
    return this.client
      .get(Endpoints.team.workspace(orgId).getById(id))
      .then((response) => response.data);
  }

  /**
   * Get Workspace detail by workspace slug
   * @param {string} slug
   * @returns {Promise<AxiosResponse<any>>}
   */
  async getWorkspaceBySlug(slug: string): Promise<AxiosResponse<any>> {
    return this.client
      .get(Endpoints.team.workspaceBySlug(slug).getBySlug())
      .then((response) => response.data);
  }

  /**`
   * Create a new workspace
   * @param {string} orgId - team id
   * @param {Object} payload - workspace payload. Example: { name: 'Workspace 1', description: 'Workspace 1 description' }
   * @returns {Promise<AxiosResponse<any>>}
   */
  async createWorkspace(
    orgId: string,
    payload: any
  ): Promise<AxiosResponse<any>> {
    return this.client
      .post(Endpoints.team.workspace(orgId).create, payload)
      .then((response) => response.data);
  }

  /**
   * Add example workspaces to team
   * @param {string} orgId - team id
   * @param {Object} payload - workspace payload. Example: { 'examples': ['workspace1', 'workspace2'] }
   * @returns {Promise<AxiosResponse<any>>}
   */
  async addExampleWorkspaces(
    orgId: string,
    payload: any
  ): Promise<AxiosResponse<any>> {
    return this.client
      .post(Endpoints.team.workspace(orgId).addExampleWorkspaces, payload)
      .then((response) => response.data);
  }

  /**
   * Add example workspaces to team using org slug
   * @param {string} slug - team slug
   * @param {Object} payload - workspace payload. Example: { 'examples': ['workspace1', 'workspace2'] }
   * @returns {Promise<AxiosResponse<any>>}
   */
  async addExampleWorkspaceBySlug(
    slug: string,
    payload: any
  ): Promise<AxiosResponse<any>> {
    return this.client
      .post(Endpoints.team.workspaceBySlug(slug).addExampleWorkspaces, payload)
      .then((response) => response.data);
  }

  /**
   * Update workspace by slug
   * @param {string} slug - workspace slug
   * @param {Object} payload - workspace payload. Example: { name: 'Workspace 1', description: 'Workspace 1 description', visibility: 'Public' }
   * @example payload:
   * {
   *   name: "Workspace 1",
   *   description: "Workspace 1 description",
   *   visibility: "public" | "private" | "deleted" | "archived"
   * }
   * @returns {Promise<AxiosResponse<any>>}
   */
  async handleUpdateWorkspaceBySlug(
    slug: string,
    payload: any
  ): Promise<AxiosResponse<any>> {
    return this.client
      .put(Endpoints.team.workspaceBySlug(slug).updateBySlug, payload)
      .then((response) => response.data);
  }

  /**
   * Delete workspace by slug
   * @param {string} slug - workspace slug
   * @returns {Promise<AxiosResponse<any>>}
   */
  async deleteWorkspaceBySlug(slug: string): Promise<AxiosResponse<any>> {
    return this.client
      .delete(Endpoints.team.workspaceBySlug(slug).deleteBySlug)
      .then((response) => response.data);
  }
}
