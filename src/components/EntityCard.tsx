import { useEffect, useRef, useState } from "react";
import { ConfirmationDialog } from "./ConfirmationDialog.tsx";
import { Button } from "./Button.tsx";
import { ItemType } from "../types";
import { DraggableCard } from "./DraggableCard.tsx";

interface EntityCardProps {
  id: string;
  name: string;
  to: string;
  index: number;
  count?: number;
  itemName?: string;
  onDelete: () => void;
  onRename?: (newName: string) => void;
  icon: string;
  move: (fromIndex: number, toIndex: number) => void;
  type: ItemType;
}

export const EntityCard = ({
  name,
  index,
  to,
  type,
  onDelete,
  itemName,
  onRename,
  count,
  icon,
  move,
  id,
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
      {isEditing ? (
        <div
          className={`relative w-full flex items-center justify-between bg-white p-4 shadow-sm rounded-md hover:shadow-md transition-all`}
        >
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
        </div>
      ) : (
        <DraggableCard
          move={move}
          index={index}
          type={type}
          key={id}
          id={id}
          name={name}
          to={to}
          onDelete={onDelete}
          onRename={onRename}
          icon={icon}
          setIsEditing={setIsEditing}
          setShowDeleteDialog={setShowDeleteDialog}
          itemName={itemName}
          count={count}
        />
      )}
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
