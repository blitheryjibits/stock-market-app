import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

export const Header:() => JSX.Element = () => {
    return (
    <header className="sticky top-0 header">
        <div className="container header-wrapper">
            <Link href="/" className="flex gap-3">
                <Image src="/assets/icons/stock-exchange-app.png" alt="StockWatch Logo" width={32} height={32} className="h-8 w-auto cursor-pointer"/>
                <p className="text-xl font-bold text-gray-100">Market Marker</p>
            </Link>
            <nav className="hidden sm:block">
                < NavItems />
            </nav>
            <UserDropdown />
        </div>
    </header>
    )
}


export default Header;