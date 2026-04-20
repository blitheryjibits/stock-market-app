import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getFullWatchlist } from "@/lib/actions/watchlist.actions";
import { getStockQuotes, searchStocks } from "@/lib/actions/finnhub.actions";
import WatchlistList from "@/components/WatchlistList";
import SearchCommand from "@/components/SearchCommand";

// interface WatchlistPageProps {

// }

export const metadata = {
  title: "My Watchlist",
  description: "View and manage your stock watchlist",
};

export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const email = session.user.email;

  // Fetch initial stocks for SearchCommand
  const initialStocks = await searchStocks();

  // Fetch full watchlist items
  const watchlistItems = await getFullWatchlist(email);

  if (!watchlistItems || watchlistItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col text-center items-center">
          <h1 className="text-3xl font-bold mb-2">Your watchlist is empty</h1>
          <p className="text-gray-400 mb-6">
            Search for a stock and add it to get started.
          </p>
          <SearchCommand
            renderAs="button"
            label="Add First Stock"
            initialStocks={initialStocks}
          />
        </div>
      </div>
    );
  }

  // Fetch stock quotes for all symbols
  const symbols = watchlistItems.map((item) => item.symbol);
  const quotes = await getStockQuotes(symbols);

  // Combine watchlist items with quotes
  const watchlistWithPrices = watchlistItems.map((item) => {
    const quote = quotes[item.symbol];
    return {
      userId: item.userId,
      symbol: item.symbol,
      company: item.company,
      addedAt: item.addedAt,
      currentPrice: quote?.price ?? 0,
      changePercent: quote?.changePercent ?? 0,
      priceFormatted: quote ? `$${quote.price.toFixed(2)}` : "N/A",
      changeFormatted: quote
        ? `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`
        : "N/A",
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">My Watchlist</h1>
        <p className="text-gray-400">
          {watchlistWithPrices.length} stocks tracked
        </p>
      </div>

      <WatchlistList items={watchlistWithPrices} userEmail={email} />
    </div>
  );
}
