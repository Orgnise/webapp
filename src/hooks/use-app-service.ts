import { useContext } from "react";
import { AppServiceContext } from "../provider/app-service.provider";
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
  const authService = appService.authService;
  const teamService = appService.teamService;
  const workspaceService = appService.workspaceService;
  const collectionService = appService.collectionService;
  return { authService, teamService, workspaceService, collectionService };
}
