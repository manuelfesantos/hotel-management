import { Link, useParams } from "react-router-dom";
import { useHotelStore } from "../store";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { Header } from "./Header.tsx";
import { ItemTypeEnum } from "../types";
import { instanceOfMachine, instanceOfRoom } from "../utils";
import { EntityCard } from "./EntityCard.tsx";

export const FloorPage: React.FC = () => {
  const { floorId } = useParams<{ floorId: string }>();
  const {
    hotel,
    addRoom,
    updateRoomOrder,
    deleteRoom,
    renameEntity,
    addMachineToFloor,
  } = useHotelStore();

  const floor = hotel.floors.find((floor) => floor.id === floorId);
  if (!floor) return <div>Floor not found</div>;

  const moveRoom = (fromIndex: number, toIndex: number) => {
    updateRoomOrder(floorId!, fromIndex, toIndex);
  };

  return (
    <PageLayout>
      <Header />
      <div className="flex w-full items-center gap-4 mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← Voltar ao Hotel
        </Link>
        <div className="flex flex-1 justify-between items-center mb-4">
          <h1 className="text-2xl">{floor.name}</h1>
          <div className={"flex gap-4"}>
            <Button
              onClick={() =>
                addRoom(
                  floorId!,
                  `Quarto ${floor.rooms.filter(instanceOfRoom).length + 1}`,
                )
              }
              className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
            >
              Adicionar Quarto
            </Button>
            <Button
              onClick={() =>
                addMachineToFloor(
                  floorId!,
                  `Máquina ${floor.rooms.filter(instanceOfMachine).length + 1}`,
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
        {floor.rooms.map((room, index) =>
          instanceOfRoom(room) ? (
            <EntityCard
              key={room.id}
              index={index}
              move={moveRoom}
              onDelete={() => deleteRoom(room.id)}
              to={`/floors/${floorId}/rooms/${room.id}`}
              name={room.name}
              id={room.id}
              type={ItemTypeEnum.ROOM}
              count={room.spaces.length}
              itemName={"Espaço"}
              onRename={(newName) => {
                renameEntity("room", room.id, newName);
              }}
              icon={"🚪"}
            />
          ) : (
            <EntityCard
              key={room.id}
              index={index}
              move={moveRoom}
              onDelete={() => deleteRoom(room.id)}
              to={`/floors/${floorId}/machines/${room.id}`}
              name={room.name}
              id={room.id}
              type={ItemTypeEnum.ROOM}
              onRename={(newName) => {
                renameEntity("machine", room.id, newName);
              }}
              icon={"⚙️"}
            />
          ),
        )}
      </CardList>
    </PageLayout>
  );
};
