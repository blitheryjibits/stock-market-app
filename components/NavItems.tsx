"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SearchCommand from "./SearchCommand";

const NavItems = ({
  initialStocks,
  className,
}: {
  initialStocks: StockWithWatchlistStatus[];
  className?: string;
}) => {
  const pathname: string = usePathname();
  const isActive: (path: string) => boolean = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <ul className={clsx("flex p-2 gap-3 font-medium", className)}>
      {NAV_ITEMS.map(({ href, label }) => {
        if (href === "/search")
          return (
            <li key="search-trigger">
              <SearchCommand
                renderAs="text"
                label="Search"
                initialStocks={initialStocks}
              />
            </li>
          );

        return (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                "search-text transition-colors",
                isActive(href) && "text-gray-100",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
