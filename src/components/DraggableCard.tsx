import { ItemType } from "../types";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import { Badge } from "./Badge.tsx";
import { Button } from "./Button.tsx";

interface DraggableCardProps {
  index: number;
  move: (fromIndex: number, toIndex: number) => void;
  onDelete: () => void;
  to: string;
  id: string;
  name: string;
  type: ItemType;
  count?: number;
  itemName?: string;
  onRename?: (newName: string) => void;
  icon: string;
  setIsEditing: (isEditing: boolean) => void;
  setShowDeleteDialog: (showDeleteDialog: boolean) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  index,
  move,
  setShowDeleteDialog,
  setIsEditing,
  to,
  id,
  name,
  type,
  count,
  itemName,
  onRename,
  icon,
}) => {
  const [{ isDragging }, ref] = useDrag({
    type: type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        move(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      key={id}
    >
      <div
        className={`relative w-full flex items-center justify-between bg-white p-4 shadow-sm rounded-md hover:shadow-md transition-all`}
      >
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
      </div>
    </div>
  );
};
