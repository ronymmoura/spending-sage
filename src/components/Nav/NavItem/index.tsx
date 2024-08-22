import { cn } from "@kamalion/ui";
import { Link, useLocation } from "@tanstack/react-router";

type NavItemProps = {
  icon: any;
  title: string;
  link: string;
};

export function NavItem({ icon, title, link }: NavItemProps) {
  const location = useLocation();

  const active = location.href === link;

  return (
    <li>
      <Link
        to={link}
        className={cn(
          "flex items-center font-light rounded-xl px-4 py-2",
          "transition-all hover:bg-accent",
          active && "bg-accent font-semibold",
        )}
      >
        <div className="w-10 flex justify-center">{icon}</div>
        <div>{title}</div>
      </Link>
    </li>
  );
}
