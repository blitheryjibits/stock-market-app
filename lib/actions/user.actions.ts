"use server";

import { connectToDatabase } from "@/database/mongoose";
import { auth } from "@/lib/better-auth/auth";

export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    const users = await db
      .collection("user")
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } },
      )
      .toArray();

    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id?.toString() || "",
        email: user.email,
        name: user.name,
      }));
  } catch (error) {
    console.error("Error fetching users for news email:", error);
    return [];
  }
};

export async function updateUserProfile(data: {
  newName?: string;
  image?: string;
}) {
  const session = await auth.api.getSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  // Build a body object that only includes defined fields
  const body: Record<string, unknown> = {};

  if (data.newName !== undefined) {
    body.displayName = data.newName;
  }

  if (data.image !== undefined) {
    body.image = data.image;
  }

  // If nothing to update, exit early
  if (Object.keys(body).length === 0) {
    return { success: false, message: "No fields to update" };
  }

  // Update only the provided fields
  const updated = await auth.api.updateUser({ body });

  return { success: true, user: updated };
}
