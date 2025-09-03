import clsx from "clsx";
import { Link, type LinkProps } from "react-router-dom";

const LinkCellphone = ({ children, className, ...props }: LinkProps) => {
  return (
    <Link {...props} className={clsx("font-bold text-[#0d0204]", className)}>
      {children}
    </Link>
  );
};
export default LinkCellphone;
