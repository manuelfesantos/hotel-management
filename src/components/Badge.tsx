export const Badge = ({
  count,
  itemName,
}: {
  count: number;
  itemName?: string;
}) => {
  const name = itemName || "item";
  return (
    <span
      className="ml-2 bg-gray-100 text-gray-600 px-2 w-fit py-1 rounded-full text-xs font-medium"
      style={{ padding: "6px" }}
    >
      {count} {count === 1 ? name : `${name}s`}
    </span>
  );
};
