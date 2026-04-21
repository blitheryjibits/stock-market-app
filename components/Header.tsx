import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getUserProfile } from "@/lib/actions/profile.actions";

export const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();
  const profile = await getUserProfile(user.email);

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex gap-3">
          <Image
            src="/assets/icons/stock-exchange-app.png"
            alt="StockWatch Logo"
            width={32}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
          <p className="text-xl font-bold text-gray-100">Market Marker</p>
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>

        <UserDropdown
          user={user}
          profileImage={profile.image}
          profileName={profile.displayName || profile.fullName}
          initialStocks={initialStocks}
        />
      </div>
    </header>
  );
};

export default Header;
