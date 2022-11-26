
import { useContext } from "react";
import { AppServiceContext } from "../context/app-service.context";
import AppService from "../service/app-service";

/**
 * Hook to get the app service
 * @returns {AppService} AppService
 * @example
 * const appService = useAppService();
 * appService.boardService.getBoard();
 */
export function useAppService() {
    const appService = useContext<AppService>(AppServiceContext as any);
    const boardService = appService.boardService;
    const authService = appService.authService;
    const organizationService = appService.organizationService;
    const projectService = appService.projectService;
    return { boardService, authService, organizationService, projectService };
}