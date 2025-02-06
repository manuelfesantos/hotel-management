import { Link, useParams } from "react-router-dom";
import { useHotelStore } from "../store";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { Header } from "./Header.tsx";
import { DraggableCard } from "./DraggableCard.tsx";
import { ItemTypeEnum } from "../types";

export const FloorPage: React.FC = () => {
  const { floorId } = useParams<{ floorId: string }>();
  const { hotel, addRoom, updateRoomOrder, deleteRoom, renameEntity } =
    useHotelStore();

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
          <Button
            onClick={() =>
              addRoom(floorId!, `Quarto ${floor.rooms.length + 1}`)
            }
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
          >
            Adicionar Quarto
          </Button>
        </div>
      </div>
      <CardList>
        {floor.rooms.map((room, index) => (
          <DraggableCard
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
        ))}
      </CardList>
    </PageLayout>
  );
};
