import { Link, useLocation } from "react-router-dom";
import { useHotelStore } from "../store";
import { instanceOfRoom } from "../utils";

export const Breadcrumbs = () => {
  const { hotel } = useHotelStore();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const getEntity = (entityType: string, entityId: string) => {
    switch (entityType) {
      case "floors":
        return hotel.floors.find((f) => f.id === entityId);
      case "rooms":
        return hotel.floors
          .flatMap((f) => f.rooms)
          .find((r) => r.id === entityId);
      case "spaces":
        return hotel.floors
          .flatMap((f) => f.rooms)
          .filter(instanceOfRoom)
          .flatMap((r) => r.spaces)
          .find((s) => s.id === entityId);
      default:
        return null;
    }
  };

  const crumbs = pathnames.reduce<Array<{ name: string; path: string }>>(
    (acc, curr, index) => {
      if (index % 2 === 1) {
        // Skip the empty string and process pairs
        const entityType = pathnames[index - 1];
        const entityId = curr;
        const path = `/${pathnames.slice(0, index + 1).join("/")}`;

        const entity = getEntity(entityType, entityId);
        if (entity) {
          acc.push({
            name: entity.name,
            path: path,
          });
        }
      }
      return acc;
    },
    [{ name: "Hotel", path: "/" }],
  );

  return (
    <nav className="mb-4 flex items-centerspace-x-2 gap-1 text-sm text-gray-500">
      {crumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-1">
          {index > 0 && <span className="mx-2">/</span>}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-gray-900">{crumb.name}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-blue-600">
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
