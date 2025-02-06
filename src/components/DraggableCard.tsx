import { ItemType } from "../types";
import { useDrag, useDrop } from "react-dnd";
import { EntityCard } from "./EntityCard.tsx";

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
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  index,
  move,
  onDelete,
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
      <EntityCard
        id={id}
        name={name}
        count={count}
        itemName={itemName}
        to={to}
        onDelete={onDelete}
        onRename={onRename}
        icon={icon}
      />
    </div>
  );
};
