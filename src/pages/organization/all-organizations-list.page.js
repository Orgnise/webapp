import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import Nav from "../task/component/nav";

import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Comments,
  getLoggedInRoute,
  getProtectedRoute,
  NoPageFound,
} from "../../helper/routes.helper";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";
import { useAppService } from "../../hooks/use-app-service";
import { SocketEvent } from "../../constant/socket-event-constant";
import useSocket from "../../hooks/use-socket.hook";
import FIcon from "../../components/ficon";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import AddOrganization from "./component/add-organization";
import ModalForm from "../../components/modal";
import OrganizationPage from "./detail/organization";
import Breadcrumb from "../../components/breadcrumb";
import { WithBreadcrumb } from "../../components/compound/withbreadcrumn";
import { NavbarLayout } from "../layout";
import Button from "../../components/atom/button";
import DropDown from "../../components/dropdown";
import CustomDropDown from "../../components/custom_dropdown";
import { ListView } from "../../components/compound/list-view";

const AllOrganizationsList = () => {
  const params = useParams();
  const id = params.id;
  return (
    <WithBreadcrumb
      BCrumb={
        <Breadcrumb
          className="py-6"
          items={[
            {
              label: "Dashboard",
              link: "/",
            },
            {
              label: "Organizations",
              link: AppRoutes.organization.allOrganizations,
            },
          ]}
        />
      }
    >
      <OrganizationList />
    </WithBreadcrumb>
  );
};

export function OrganizationList() {
  const [organization, setOrganization] = useState([]);
  const [loading, setLoading] = useState();
  const [visible, setVisible] = useState(false);
  const { organizationService } = useAppService();

  const [user, setUser] = useLocalStorage("user");
  const navigate = useNavigate();
  const createOrganization = SocketEvent.organization.create;
  useSocket([createOrganization], (event, data) => {
    if (event === createOrganization) {
      setOrganization((prev) => [...prev, data]);
      toast.success("Organization created successfully", {
        position: "top-right",
      });
    }
  });

  // Fetch organization list in which authenticated user is member | owner | admin
  useEffect(() => {
    if (user) {
      setLoading(true);
      organizationService
        .getAllOrganizations()
        .then(({ companies }) => {
          setOrganization(companies);
        })
        .catch(({ response }) => {
          console.log(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="OrganizationList h-screen flex flex-col">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <section className="flex flex-col bg-white py-4 md:py-7  md:px-8 xl:px-10 mt-28 h-full overflow-y-auto items-center">
        <div className="divide-y max-w-xl w-full px-2 sm:px-0">
          <div className="flex flex-col  gap-5 ">
            <div className="flex">
              <h1 className="font-medium text-2xl flex-1 ">Organization</h1>
              <Button
                label="Create Organization"
                type="link"
                size="small"
                onClick={() => {
                  navigate(AppRoutes.organization.create);
                }}
              />
            </div>
            <ListView
              items={organization}
              loading={loading}
              noItemsElement={
                <div className="p-4 rounded bg-gray-100 text-xs text-slate-500">
                  You are now a member of any organization yet. Create a new
                  organization or ask someone to invite you to their
                  organization
                </div>
              }
              placeholder={
                <div className="animate-pulse p-4 rounded bg-gray-100 flex flex-col gap-2">
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                </div>
              }
              renderItem={(org, index) => (
                <OrganizationRow key={index} org={org} />
              )}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function OrganizationRow({ org, index }) {
  return (
    <div className="flex items-center border-b-[1px] py-2 first:border-t border-gray-100 hover:bg-gray-50 cursor-pointer px-4">
      <div className=" mr-2 hover:cursor-pointer w-full">
        <div className="flex">
          <Link to={`/organization/${org.id}`} className="flex-1">
            <h3 className="text-base text-gray-700">{org.name}</h3>
            <h5 className="text-xs text-gray-500">
              {org.members.length} team members
            </h5>
          </Link>
          <CustomDropDown
            button={
              <FIcon
                icon={solid("ellipsis-vertical")}
                className="text-slate-400  w-5 h-5 z-0"
              />
            }
          >
            <div className="text-left px-4 py-2 bg-white w-56 rounded-md">
              Team Settings
            </div>
          </CustomDropDown>
        </div>
      </div>
    </div>
  );
}

export default AllOrganizationsList;
