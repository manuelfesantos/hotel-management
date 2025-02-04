import { useHotelStore } from "../hooks/HotelStore.tsx";
import { EntityCard } from "./EntityCard";
import { Breadcrumbs } from "./BreadCrumbs.tsx";
import { Button } from "./Button.tsx";
import { CardList } from "./CardList.tsx";
import { PageLayout } from "./PageLayout.tsx";
import { useState } from "react";
import { TreeDiagram } from "./TreeDiagram.tsx";
import { PDFIcon } from "./PdfIcon.tsx";

export const HotelPage = () => {
  const { hotel, addFloor, deleteFloor, renameEntity, importData, exportData } =
    useHotelStore();
  const [showTree, setShowTree] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importData(data);
        } catch (error) {
          console.log(error);
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <PageLayout>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Pisos do Hotel</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => addFloor(`Floor ${hotel.floors.length + 1}`)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Adicionar Piso
          </Button>
          <Button onClick={exportData}>Exportar</Button>
          <Button onClick={() => setShowTree(true)}>
            <PDFIcon className="w-5 h-5" />
            Exportar como PDF
          </Button>
          <label
            className="bg-purple-500 flex flex-col items-center justify-center text-white p-2 rounded cursor-pointer"
            style={{ padding: "6px" }}
          >
            Importar
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <CardList>
        {hotel.floors.map((floor) => (
          <EntityCard
            key={floor.id}
            id={floor.id}
            name={"Piso " + floor.id}
            to={`/floors/${floor.id}`}
            count={floor.rooms.length}
            itemName={"Quarto"}
            onDelete={() => deleteFloor(floor.id)}
            onRename={(newName) => renameEntity("floor", floor.id, newName)}
          />
        ))}
      </CardList>
      {showTree && <TreeDiagram onClose={() => setShowTree(false)} />}
    </PageLayout>
  );
};
