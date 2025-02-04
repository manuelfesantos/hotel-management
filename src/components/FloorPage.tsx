import { Link, useParams } from "react-router-dom";
import { useHotelStore } from "../hooks/HotelStore.tsx";
import { EntityCard } from "./EntityCard";
import { Breadcrumbs } from "./BreadCrumbs.tsx";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";

export const FloorPage = () => {
  const { floorId } = useParams<{ floorId: string }>();
  const { hotel, addRoom, deleteRoom, renameEntity } = useHotelStore();

  const floor = hotel.floors.find((floor) => floor.id === floorId);

  if (!floor) return <div>Floor not found</div>;

  return (
    <PageLayout>
      <Breadcrumbs />
      <div className="flex w-full items-center gap-4 mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          ← Voltar ao Hotel
        </Link>
        <div className="flex flex-1 justify-between items-center mb-4">
          <h1 className="text-2xl">{"Piso " + floor.id}</h1>
          <Button
            onClick={() =>
              addRoom(floorId!, `Quarto ${floor.rooms.length + 1}`)
            }
          >
            Adicionar Quarto
          </Button>
        </div>
      </div>
      <CardList>
        {floor.rooms.map((room) => (
          <EntityCard
            key={room.id}
            id={room.id}
            name={"Quarto " + room.id}
            count={room.spaces.length}
            itemName={"Espaço"}
            to={`/floors/${floor.id}/rooms/${room.id}`}
            onDelete={() => deleteRoom(room.id)}
            onRename={(newName) => renameEntity("room", room.id, newName)}
          />
        ))}
      </CardList>
    </PageLayout>
  );
};
