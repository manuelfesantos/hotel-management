export const CardList = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col w-9/10 gap-4 ${className}`}>{children}</div>
  );
};
