import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ConfirmationDialog } from "./ConfirmationDialog.tsx";
import { Button } from "./Button.tsx";
import { Badge } from "./Badge.tsx";

interface EntityCardProps {
  id: string;
  name: string;
  to: string;
  count?: number;
  itemName?: string;
  onDelete: () => void;
  onRename?: (newName: string) => void;
  icon: string;
}

export const EntityCard = ({
  name,
  to,
  onDelete,
  itemName,
  onRename,
  count,
  icon,
}: EntityCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRename = () => {
    onRename?.(newName);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <>
      <div
        className={`relative w-full flex items-center justify-between bg-white p-4 shadow-sm rounded-md hover:shadow-md transition-all`}
      >
        {isEditing ? (
          <div className="w-full flex gap-3 items-center bg-white">
            <input
              value={newName}
              ref={inputRef}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 flex-1 rounded-md"
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
            <Button onClick={handleRename}>Guardar</Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-1 pl-3">
              <Link
                to={to}
                className="text-lg font-medium text-gray-900 hover:text-blue-600"
              >
                {icon} {name}
              </Link>
            </div>
            {count !== undefined && (
              <div className="flex flex-col flex-1 pl-3">
                <Badge count={count} itemName={itemName} />
              </div>
            )}
            <div className="flex items-center gap-3">
              {onRename && (
                <Button onClick={() => setIsEditing(true)}>✏️ Editar</Button>
              )}
              <Button
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️ Apagar
              </Button>
            </div>
          </>
        )}
      </div>
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Confirmar"
        message={`Tens a certeza que queres apagar o ${name}?`}
        onConfirm={() => {
          onDelete();
          setShowDeleteDialog(false);
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
};
