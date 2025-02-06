import { ReactNode } from "react";

export const PageLayout = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  return <div className={"p-4 h-full flex flex-col gap-2"}>{children}</div>;
};
