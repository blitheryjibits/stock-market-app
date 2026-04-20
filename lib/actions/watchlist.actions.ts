"use server";

import { connectToDatabase } from "@/database/mongoose";
import {
  Watchlist,
  type WatchlistItem,
} from "@/database/models/watchlist.model";

async function getUserIdByEmail(email: string): Promise<string | null> {
  if (!email) return null;

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return null;

    return (user.id as string) || String(user._id || "");
  } catch (err) {
    console.error("getUserIdByEmail error:", err);
    return null;
  }
}

export async function getWatchlistSymbolsByEmail(
  email: string,
): Promise<string[]> {
  if (!email) return [];

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];

    await connectToDatabase();
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export async function addToWatchlist(
  email: string,
  symbol: string,
  company: string,
): Promise<{ success: boolean; message?: string }> {
  if (!email || !symbol || !company) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return { success: false, message: "User not found" };
    }

    await connectToDatabase();

    // Upsert: if exists, do nothing; if not exists, insert with company and addedAt
    await Watchlist.updateOne(
      { userId, symbol: symbol.toUpperCase() },
      {
        $setOnInsert: {
          userId,
          symbol: symbol.toUpperCase(),
          company,
          addedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return { success: true };
  } catch (err) {
    console.error("addToWatchlist error:", err);
    return { success: false, message: "Failed to add to watchlist" };
  }
}

export async function removeFromWatchlist(
  email: string,
  symbol: string,
): Promise<{ success: boolean; message?: string }> {
  if (!email || !symbol) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return { success: false, message: "User not found" };
    }

    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

    return { success: true };
  } catch (err) {
    console.error("removeFromWatchlist error:", err);
    return { success: false, message: "Failed to remove from watchlist" };
  }
}

export async function getFullWatchlist(
  email: string,
): Promise<WatchlistItem[]> {
  if (!email) return [];

  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];

    await connectToDatabase();
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    return items as WatchlistItem[];
  } catch (err) {
    console.error("getFullWatchlist error:", err);
    return [];
  }
}
