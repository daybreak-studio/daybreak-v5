import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ElementType;
  children?: React.ReactNode;
  noFill?: boolean;
  small?: boolean;
};

const IconButton = ({
  icon: IconElement,
  noFill,
  children,
  small,
  disabled,
  ...props
}: Props) => {
  const sizeStyle = small ? "w-6 h-6" : "w-10 h-10";
  const disabledStyle = disabled ? "opacity-30" : "opacity-100";

  return (
    <button
      className={`relative inline-flex ${disabledStyle} ${sizeStyle} items-center justify-center rounded-xl ${noFill ? "" : "bg-gray-100"}`}
      {...props}
    >
      <IconElement className={disabledStyle} />
      {children && <div className="absolute">{children}</div>}
    </button>
  );
};

export default IconButton;
