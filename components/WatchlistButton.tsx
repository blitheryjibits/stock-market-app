"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  addToWatchlist,
  getWatchlistSymbolsByEmail,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist = false,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
  email,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [loading, setLoading] = useState<boolean>(Boolean(email));
  const [isMutating, startTransition] = useTransition();

  useEffect(() => {
    if (!email) {
      setAdded(!!isInWatchlist);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadWatchlist = async () => {
      try {
        const symbols = await getWatchlistSymbolsByEmail(email);
        if (!mounted) return;
        setAdded(symbols.includes(symbol.toUpperCase()));
      } catch (err) {
        console.error("Failed to check watchlist:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadWatchlist();
    return () => {
      mounted = false;
    };
  }, [email, symbol, isInWatchlist]);

  const handleWatchlistToggle = async () => {
    if (isMutating || loading) return;

    startTransition(async () => {
      try {
        if (!email) {
          setAdded((prev) => {
            const next = !prev;
            onWatchlistChange?.(symbol, next);
            return next;
          });
          toast.error("Sign in to save this stock to your watchlist.");
          return;
        }

        if (added) {
          const result = await removeFromWatchlist(email, symbol);
          if (result.success) {
            setAdded(false);
            toast.success("Removed from Watchlist");
            onWatchlistChange?.(symbol, false);
          } else {
            toast.error(result.message || "Something went wrong.");
          }
        } else {
          const result = await addToWatchlist(email, symbol, company);
          if (result.success) {
            setAdded(true);
            toast.success("Added to Watchlist");
            onWatchlistChange?.(symbol, true);
          } else {
            toast.error(result.message || "Something went wrong.");
          }
        }
      } catch (err) {
        console.error("Error toggling watchlist:", err);
        toast.error("Something went wrong.");
      }
    });
  };

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    if (loading) return "Loading...";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, loading, type]);

  if (type === "icon") {
    return (
      <button
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleWatchlistToggle}
        disabled={isMutating || loading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "#FACC15" : "none"}
          stroke="#FACC15"
          strokeWidth="1.5"
          className="watchlist-star"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleWatchlistToggle}
      disabled={isMutating || loading}
      className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
    >
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
          />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
