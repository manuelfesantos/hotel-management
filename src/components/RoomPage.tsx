import { Link, useParams } from "react-router-dom";
import { useHotelStore } from "../store";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { Header } from "./Header.tsx";
import { instanceOfMachine, instanceOfRoom, instanceOfSpace } from "../utils";
import { ItemTypeEnum } from "../types";
import { EntityCard } from "./EntityCard.tsx";

export const RoomPage = () => {
  const { floorId, roomId } = useParams<{ floorId: string; roomId: string }>();
  const {
    hotel,
    addSpace,
    deleteSpace,
    updateSpaceOrder,
    addMachineToRoom,
    renameEntity,
  } = useHotelStore();

  const room = hotel.floors
    .flatMap((floor) => floor.rooms)
    .find((room) => room.id === roomId);

  if (!room || !instanceOfRoom(room)) return <div>Room not found</div>;

  const parentFloor = hotel.floors.find((floor) =>
    floor.rooms.some((room) => room.id === roomId),
  );

  const moveSpace = (fromIndex: number, toIndex: number) => {
    updateSpaceOrder(roomId!, fromIndex, toIndex);
  };

  return (
    <PageLayout>
      <Header />
      <div className="flex w-full items-center gap-4 mb-4">
        {parentFloor && (
          <Link
            to={`/floors/${parentFloor.id}`}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← Voltar a {parentFloor.name}
          </Link>
        )}
        <div className="flex flex-1 justify-between items-center mb-4">
          <h1 className="text-2xl">{room.name}</h1>
          <div className={"flex gap-4"}>
            <Button
              onClick={() =>
                addSpace(
                  roomId!,
                  "Espaço " + (room.spaces.filter(instanceOfSpace).length + 1),
                )
              }
              className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
            >
              Adicionar Espaço
            </Button>
            <Button
              onClick={() =>
                addMachineToRoom(
                  roomId!,
                  "Máquina " +
                    (room.spaces.filter(instanceOfMachine).length + 1),
                )
              }
              className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
            >
              Adicionar Máquina
            </Button>
          </div>
        </div>
      </div>

      <CardList>
        {room.spaces.map((space, index) =>
          instanceOfSpace(space) ? (
            <EntityCard
              type={ItemTypeEnum.SPACE}
              index={index}
              move={moveSpace}
              key={space.id}
              id={space.id}
              name={space.name}
              count={space.machines.length}
              itemName={"Máquina"}
              to={`/floors/${floorId}/rooms/${room.id}/spaces/${space.id}`}
              onDelete={() => deleteSpace(space.id)}
              onRename={(newName) => renameEntity("space", space.id, newName)}
              icon={"🗄"}
            />
          ) : (
            <EntityCard
              index={index}
              move={moveSpace}
              onDelete={() => deleteSpace(space.id)}
              to={""}
              id={space.id}
              name={space.name}
              type={ItemTypeEnum.SPACE}
              onRename={(newName) => renameEntity("machine", space.id, newName)}
              icon={"⚙️"}
            />
          ),
        )}
      </CardList>
    </PageLayout>
  );
};
