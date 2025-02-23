import { FC } from "react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export const Input: FC<Props> = ({
  onChange,
  ...props
}) => (
  <input className="outline-none border-1 border-indigo-950 rounded-md py-1 px-4" type="text" onChange={({ target: { value } }) => onChange?.(value)} {...props} />
)