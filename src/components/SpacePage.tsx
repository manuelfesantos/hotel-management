import { Link, useParams } from "react-router-dom";
import { useHotelStore } from "../hooks/HotelStore.tsx";
import { EntityCard } from "./EntityCard";
import { Breadcrumbs } from "./BreadCrumbs.tsx";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";

export const SpacePage = () => {
  const { floorId, roomId, spaceId } = useParams<{
    floorId: string;
    roomId: string;
    spaceId: string;
  }>();
  const { hotel, addMachine, deleteMachine, renameEntity } = useHotelStore();

  const space = hotel.floors
    .flatMap((floor) => floor.rooms)
    .flatMap((room) => room.spaces)
    .find((space) => space.id === spaceId);

  if (!space) return <div>Space not found</div>;

  const parentRoom = hotel.floors
    .flatMap((floor) => floor.rooms)
    .find((room) => room.spaces.some((space) => space.id === spaceId));

  return (
    <PageLayout>
      <Breadcrumbs />
      <div className="flex w-full items-center gap-4 mb-4">
        {parentRoom && (
          <Link
            to={`/floors/${floorId}/rooms/${roomId}`}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← Voltar a {"Quarto " + parentRoom.id}
          </Link>
        )}
        <div className="flex flex-1 justify-between items-center mb-4">
          <h1 className="text-2xl">{space.name}</h1>
          <Button
            onClick={() =>
              addMachine(spaceId!, `Máquina ${space.machines.length + 1}`)
            }
          >
            Adicionar Máquina
          </Button>
        </div>
      </div>

      <CardList>
        {space.machines.map((machine) => (
          <EntityCard
            key={machine.id}
            id={machine.id}
            name={machine.name}
            to="" // Machines are leaf nodes
            onDelete={() => deleteMachine(machine.id)}
            onRename={(newName) => renameEntity("machine", machine.id, newName)}
          />
        ))}
      </CardList>
    </PageLayout>
  );
};
