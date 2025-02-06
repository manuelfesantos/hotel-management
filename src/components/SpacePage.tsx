import { Link, useParams } from "react-router-dom";
import { useHotelStore } from "../store";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { Header } from "./Header.tsx";
import { ItemTypeEnum } from "../types";
import { instanceOfRoom, instanceOfSpace } from "../utils";
import { EntityCard } from "./EntityCard.tsx";

export const SpacePage = () => {
  const { floorId, roomId, spaceId } = useParams<{
    floorId: string;
    roomId: string;
    spaceId: string;
  }>();
  const {
    hotel,
    addMachineToSpace,
    deleteMachine,
    renameEntity,
    updateSpaceMachineOrder,
  } = useHotelStore();

  const space = hotel.floors
    .flatMap((floor) => floor.rooms)
    .filter(instanceOfRoom)
    .flatMap((room) => room.spaces)
    .find((space) => space.id === spaceId);

  if (!space || !instanceOfSpace(space)) return <div>Space not found</div>;

  const parentRoom = hotel.floors
    .flatMap((floor) => floor.rooms)
    .filter(instanceOfRoom)
    .find((room) => room.spaces.some((space) => space.id === spaceId));

  const moveMachine = (fromIndex: number, toIndex: number) => {
    updateSpaceMachineOrder(spaceId!, fromIndex, toIndex);
  };

  return (
    <PageLayout>
      <Header />
      <div className="flex w-full items-center gap-4 mb-4">
        {parentRoom && (
          <Link
            to={`/floors/${floorId}/rooms/${roomId}`}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← Voltar a {parentRoom.name}
          </Link>
        )}
        <div className="flex flex-1 justify-between items-center mb-4">
          <h1 className="text-2xl">{space.name}</h1>
          <Button
            onClick={() =>
              addMachineToSpace(
                spaceId!,
                `Máquina ${space.machines.length + 1}`,
              )
            }
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
          >
            Adicionar Máquina
          </Button>
        </div>
      </div>

      <CardList>
        {space.machines.map((machine, index) => (
          <EntityCard
            id={machine.id}
            name={machine.name}
            to={""}
            onDelete={() => deleteMachine(machine.id)}
            onRename={(newName) => renameEntity("machine", machine.id, newName)}
            icon={"⚙️"}
            move={moveMachine}
            index={index}
            type={ItemTypeEnum.MACHINE}
          />
          /**/
        ))}
      </CardList>
    </PageLayout>
  );
};
