import { ZodOpenApiPathsObject } from "zod-openapi";

import { createTeam } from "./create-team";
import { getTeamInfo } from "./get-team-info";
import { getTeams } from "./get-teams";
import { updateTeam } from "./update-a team";

export const teamsPath: ZodOpenApiPathsObject = {
  "/teams": {
    get: getTeams,
    post: createTeam,
  },
  "/teams/{team_slug}": {
    get: getTeamInfo,
    put: updateTeam
  },
};
