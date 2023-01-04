import cx from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import { ListView } from "../../../../../components/compound/list-view";
import Label from "../../../../../components/typography";
import { LeftPanelSize } from "../../../layout/workspace-content-view";
import NoCollectionView from "./no-collection.view";

/**
 * Display collection board
 */
export default function CollectionBoard({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  setLeftPanelSize = (i) => {},
}) {
  const slug = workspace?.meta?.slug;
  const pathArray = useLocation().pathname.split(slug);
  const relativePath = pathArray[0] + workspace.meta.slug;

  return (
    <ListView
      className="flex h-full overflow-x-auto  gap-4  mx-2"
      items={allCollection}
      loading={isLoadingCollection}
      renderItem={(collection, index) => (
        <div className="CollectionColumn h-full  p-2 w-64">
          <div className="w-76 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Label size="body" variant="t2">
              {collection.title}
            </Label>
          </div>
          <ListView
            items={collection.children}
            className="hover:bg-default/60 rounded h-full overflow-hidden p-2"
            renderItem={(item, index) => (
              <NavLink
                to={`${relativePath}/${item.id}`}
                onClick={(e) => {
                  setLeftPanelSize(LeftPanelSize.large);
                }}
                className={(data) =>
                  cx(
                    "group link py-3 hover:bg-onSurface  bg-card rounded mb-2",
                    {
                      "link-active bg-card": data.isActive,
                      "link-inactive": !data.isActive,
                    }
                  )
                }
              >
                <Label size="body">{item.title}</Label>
              </NavLink>
            )}
          />
        </div>
      )}
      noItemsElement={<NoCollectionView />}
      placeholder={
        <>
          <div className="flex1 flex flex-col items-center place-content-center h-full">
            <Label variant="t2">Loading...</Label>
          </div>
        </>
      }
    />
  );
}
