import { Link, useParams } from "react-router-dom";
import { SpaceNameEnum, useHotelStore } from "../hooks/HotelStore.tsx";
import { EntityCard } from "./EntityCard";
import { Breadcrumbs } from "./BreadCrumbs.tsx";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";

export const RoomPage = () => {
  const { floorId, roomId } = useParams<{ floorId: string; roomId: string }>();
  const { hotel, addSpace, deleteSpace, renameEntity } = useHotelStore();

  const room = hotel.floors
    .flatMap((floor) => floor.rooms)
    .find((room) => room.id === roomId);

  if (!room) return <div>Room not found</div>;

  const parentFloor = hotel.floors.find((floor) =>
    floor.rooms.some((room) => room.id === roomId),
  );

  return (
    <PageLayout>
      <Breadcrumbs />
      <div className="flex w-full items-center gap-4 mb-4 px-4">
        {parentFloor && (
          <Link
            to={`/floors/${parentFloor.id}`}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← Voltar a {"Piso " + parentFloor.id}
          </Link>
        )}
        <div className="flex flex-1 justify-between items-center mb-4">
          <h1 className="text-2xl">{"Quarto " + room.id}</h1>
          <div className={"flex gap-4"}>
            {Object.keys(SpaceNameEnum).map((key) => (
              <Button
                onClick={() =>
                  addSpace(
                    roomId!,
                    SpaceNameEnum[key as keyof typeof SpaceNameEnum],
                  )
                }
                disabled={room.spaces.some(
                  (space) =>
                    space.name ===
                    SpaceNameEnum[key as keyof typeof SpaceNameEnum],
                )}
              >
                Adicionar {SpaceNameEnum[key as keyof typeof SpaceNameEnum]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <CardList>
        {room.spaces.map((space) => (
          <EntityCard
            key={space.id}
            id={space.id}
            name={space.name}
            count={space.machines.length}
            itemName={"Máquina"}
            to={`/floors/${floorId}/rooms/${room.id}/spaces/${space.id}`}
            onDelete={() => deleteSpace(space.id)}
            onRename={(newName) => renameEntity("space", space.id, newName)}
          />
        ))}
      </CardList>
    </PageLayout>
  );
};
