import React, { useState, useEffect } from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { useAppService } from "../../../hooks/use-app-service";
import useLocalStorage from "../../../hooks/use-local-storage";

export const ORGANIZATION_PAGE_ROUTES = "/organization/:id";
export default function OrganizationPage() {
  const [organization, setOrganization] = useState();
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;
  const { organizationService } = useAppService();
  const [user, setUser] = useLocalStorage("user");

  // Fetch organization list in which authenticated user is member | owner | admin
  useEffect(() => {
    console.log("Fetching organization detail");
    if (user) {
      setLoading(true);
      organizationService
        .getCompanyById(id)
        .then(({ company }) => {
          console.log("res", company);
          setOrganization(company);
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
          <p className="text-3xl font-bold">
            {organization && <>{organization.name}</>}
          </p>
        )}
      </div>
    </div>
  );
}
