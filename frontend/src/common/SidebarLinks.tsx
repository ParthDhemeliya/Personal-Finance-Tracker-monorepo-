import Link from "next/link";

type SidebarLinksProps = {
  currentPath: string;
  onNavigate?: () => void;
};

const SidebarLinks = ({ currentPath, onNavigate }: SidebarLinksProps) => {
  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", color: "gray" },
    { label: "Income", path: "/dashboard/income", color: "blue" },
    { label: "Expense", path: "/dashboard/expense", color: "red" },
  ];

  const colorMap = {
    gray: {
      active: "bg-white text-blue-900 font-bold border border-blue-100",
      hover: "hover:bg-white hover:text-blue-900",
    },
    blue: {
      active: "bg-blue-100 text-blue-800 font-bold border border-blue-200",
      hover: "hover:bg-blue-100 hover:text-blue-800",
    },
    red: {
      active: "bg-red-100 text-red-800 font-bold border border-red-200",
      hover: "hover:bg-red-100 hover:text-red-800",
    },
  };

  return (
    <>
      {navItems.map(({ label, path, color }) => {
        const activeStyle = isActive(path);
        const baseColor = colorMap[color as keyof typeof colorMap];

        return (
          <Link
            key={label}
            href={path}
            onClick={onNavigate}
            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeStyle
                ? baseColor.active + " scale-105 ring-2 ring-blue-200/40"
                : `text-blue-900 ${baseColor.hover}`
            }`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
};

export default SidebarLinks;
