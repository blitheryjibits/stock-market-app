"use client";
import { JSX } from "react";
import NAV_ITEMS from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NavItems:() => JSX.Element = () => {
    const pathname:string = usePathname();
    const isActive:(path:string) => boolean = (path:string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };
    
    return (
        <ul className="nav-list">
            {NAV_ITEMS.map(({href, label }) => (
                <li key={href}>
                    <Link href={href} 
                        className={clsx("search-text transition-colors", isActive(href) && "text-gray-100" )}
                    >
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default NavItems;