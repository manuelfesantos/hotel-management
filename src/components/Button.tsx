export const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"} ${className}`}
      style={{ padding: "6px" }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
