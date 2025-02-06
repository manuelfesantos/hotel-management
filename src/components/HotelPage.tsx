import { useHotelStore } from "../store";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { Header } from "./Header.tsx";
import { ItemTypeEnum } from "../types";
import { EntityCard } from "./EntityCard.tsx";

export const HotelPage = () => {
  const { hotel, addFloor, deleteFloor, updateFloorOrder, renameEntity } =
    useHotelStore();

  return (
    <PageLayout>
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Pisos do Hotel</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => addFloor(`Floor ${hotel.floors.length + 1}`)}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
          >
            Adicionar Piso
          </Button>
        </div>
      </div>

      <CardList>
        {hotel.floors.map((floor, index) => (
          <EntityCard
            index={index}
            move={updateFloorOrder}
            onDelete={() => deleteFloor(floor.id)}
            to={`/floors/${floor.id}`}
            key={floor.id}
            id={floor.id}
            name={floor.name}
            type={ItemTypeEnum.FLOOR}
            count={floor.rooms.length}
            itemName={"Quarto"}
            onRename={(newName) => renameEntity("floor", floor.id, newName)}
            icon={"🏢"}
          />
        ))}
      </CardList>
    </PageLayout>
  );
};
