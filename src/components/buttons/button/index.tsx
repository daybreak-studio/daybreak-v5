import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ElementType;
  children?: React.ReactNode;
  fill?: boolean;
};

const Button = ({ icon: IconElement, fill, children, ...props }: Props) => {
  return (
    <button className="rounded-lg bg-gray-100" {...props}>
      {IconElement && <IconElement />}
      {children}
    </button>
  );
};

export default Button;
