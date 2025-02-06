import { Breadcrumbs } from "./BreadCrumbs.tsx";
import { Button } from "./Button.tsx";
import { PDFIcon } from "./PdfIcon.tsx";
import { useHotelStore } from "../store";
import { TreeDiagram } from "./TreeDiagram.tsx";
import { useState } from "react";
import { ConfirmationDialog } from "./ConfirmationDialog.tsx";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { importData, exportData, deleteAll } = useHotelStore();
  const [showTree, setShowTree] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

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
    <>
      <header className="flex justify-between items-center mb-4">
        <Breadcrumbs />
        <div className="flex gap-2">
          <Button onClick={exportData} className={"flex gap-2"}>
            <PDFIcon className="w-5 h-5" />
            Exportar Como JSON
          </Button>
          <Button onClick={() => setShowTree(true)} className={"flex gap-2"}>
            <PDFIcon className="w-5 h-5" />
            Exportar como PDF
          </Button>
          <label
            className="bg-blue-500 flex flex-col items-center justify-center text-white p-2 rounded cursor-pointer hover:bg-blue-600"
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
          <Button onClick={() => setShowDeleteDialog(true)}>Limpar Tudo</Button>
        </div>
      </header>
      {showTree && <TreeDiagram onClose={() => setShowTree(false)} />}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Apagar Tudo"
        message={`Tens a certeza que queres apagar tudo?`}
        onConfirm={() => {
          deleteAll();
          setShowDeleteDialog(false);
          navigate("/");
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
};
