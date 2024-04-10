import { ReactNode } from "react";

interface MenuIconProps {
  icon: ReactNode;
  text: ReactNode;
}

export function IconMenu({ icon, text }: MenuIconProps) {
  return (
    <div className="flex items-center justify-start space-x-2">
      {icon}
      <p className="text-sm">{text}</p>
    </div>
  );
}
