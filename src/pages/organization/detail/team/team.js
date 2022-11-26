import React, { useState, useEffect } from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";

import useLocalStorage from "../../../../hooks/use-local-storage";
import { useAppService } from "../../../../hooks/use-app-service";

export default function TeamPage() {
  const [team, setTeam] = useState();
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;
  const { organizationService } = useAppService();
  const [user, setUser] = useLocalStorage("user");

  // Fetch team list in which authenticated user is member | owner | admin
  useEffect(() => {
    // console.log("Fetching team detail");
    if (user) {
      setLoading(true);
      organizationService
        .getCompanyById(id)
        .then(({ company }) => {
          // console.log("res", company);
          setTeam(company);
        })
        .catch(({ error }) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="pt-4">
      <div className="flex flex-col">
        {loading ? (
          <>loading..</>
        ) : (
          <p className="text-3xl font-bold">{team && <>{team.name}</>}</p>
        )}
      </div>
    </div>
  );
}
