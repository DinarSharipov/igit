import { FC, memo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export const Button: FC<Props> = memo(({ isActive, ...props }) => (
  <button className={`
    ${isActive ? 'opacity-80 scale-95 ' : ''}
    py-1 px-4 bg-indigo-950 text-white rounded-md cursor-pointer transition hover:opacity-80 button truncate`} {...props} />
))