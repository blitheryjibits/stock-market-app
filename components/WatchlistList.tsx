"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface WatchlistItem {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  currentPrice: number;
  changePercent: number;
  priceFormatted: string;
  changeFormatted: string;
}

interface WatchlistListProps {
  items: WatchlistItem[];
  userEmail: string;
}

export default function WatchlistList({
  items,
  userEmail,
}: WatchlistListProps) {
  const router = useRouter();
  const [isMutating, startTransition] = useTransition();
  const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);

  const handleRemove = async (e: React.MouseEvent, symbol: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMutating) return;

    setRemovingSymbol(symbol);
    startTransition(async () => {
      try {
        const result = await removeFromWatchlist(userEmail, symbol);
        if (result.success) {
          toast.success("Removed from Watchlist");
          router.refresh();
        } else {
          toast.error(result.message || "Failed to remove from Watchlist");
        }
      } catch (err) {
        console.error("Error removing from watchlist:", err);
        toast.error("Something went wrong");
      } finally {
        setRemovingSymbol(null);
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800 rounded-lg text-sm font-semibold text-gray-400">
        <div className="col-span-3">Symbol</div>
        <div className="col-span-3">Company</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">24h Change</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      {/* Table Rows */}
      {items.map((item) => (
        <Link
          key={item.symbol}
          href={`/stocks/${item.symbol}`}
          className="block"
        >
          <div className="grid grid-cols-12 gap-4 px-4 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            {/* Symbol */}
            <div className="col-span-12 md:col-span-3 flex items-center">
              <div className="font-bold text-lg">{item.symbol}</div>
            </div>

            {/* Company */}
            <div className="col-span-12 md:col-span-3 flex items-center">
              <div className="text-gray-400 text-sm md:text-base">
                {item.company}
              </div>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2 flex items-center justify-start md:justify-end">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                <span className="text-gray-400 text-sm md:hidden">Price: </span>
                <span className="font-semibold text-white">
                  {item.priceFormatted}
                </span>
              </div>
            </div>

            {/* 24h Change */}
            <div className="col-span-6 md:col-span-2 flex items-center justify-end">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                <span className="text-gray-400 text-sm md:hidden">
                  Change:{" "}
                </span>
                <span
                  className={`font-semibold ${
                    item.changePercent >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.changeFormatted}
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <div
              className="col-span-12 md:col-span-2 flex items-center justify-end"
              onClick={(e) => e.preventDefault()}
            >
              <Button
                onClick={(e) => handleRemove(e, item.symbol)}
                disabled={isMutating && removingSymbol === item.symbol}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4" />
                {isMutating && removingSymbol === item.symbol
                  ? "Removing..."
                  : "Remove"}
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
