"use server";

import { connectToDatabase } from "@/database/mongoose";
import { UserProfile } from "@/database/models/userProfile.model";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

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
  } catch (error) {
    console.error("getUserIdByEmail error:", error);
    return null;
  }
}

export async function ensureUserProfileExists(email: string) {
  const userId = await getUserIdByEmail(email);
  if (!userId) return null;

  await connectToDatabase();
  const existing = await UserProfile.findOne({ userId });
  if (existing) return existing;

  return UserProfile.create({
    userId,
    displayName: "",
    image: "",
    updatedAt: new Date(),
  });
}

export async function getUserProfile(email: string) {
  if (!email) return { fullName: "", displayName: "", image: "" };

  const userId = await getUserIdByEmail(email);
  if (!userId) return { fullName: "", displayName: "", image: "" };

  await connectToDatabase();

  const profile = await UserProfile.findOne({ userId });
  if (profile) {
    return {
      displayName: profile.displayName || "",
      image: profile.image || "",
    };
  }

  const created = await UserProfile.create({
    userId,
    displayName: "",
    image: "",
    updatedAt: new Date(),
  });
  return {
    displayName: created.displayName,
    image: created.image,
  };
}

export async function updateUserFullName(email: string, fullName: string) {
  if (!email) return { success: false };

  const userId = await getUserIdByEmail(email);
  if (!userId) return { success: false };

  await connectToDatabase();
  await UserProfile.updateOne(
    { userId },
    { $set: { fullName: fullName || "", updatedAt: new Date() } },
    { upsert: true },
  );

  return { success: true };
}

export async function updateUserDisplayName(
  email: string,
  displayName: string,
) {
  if (!email) return { success: false };

  const userId = await getUserIdByEmail(email);
  if (!userId) return { success: false };

  await connectToDatabase();
  await UserProfile.updateOne(
    { userId },
    { $set: { displayName: displayName || "", updatedAt: new Date() } },
    { upsert: true },
  );

  return { success: true };
}

export async function updateUserImage(email: string, imageUrl: string) {
  if (!email) return { success: false };

  const userId = await getUserIdByEmail(email);
  if (!userId) return { success: false };

  await connectToDatabase();
  await UserProfile.updateOne(
    { userId },
    { $set: { image: imageUrl || "", updatedAt: new Date() } },
    { upsert: true },
  );

  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  if (!email) {
    return { success: false };
  }

  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  let displayName = formData.get("displayName")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";

  // If display name is empty but full name is provided, use full name as display name
  if (!displayName && fullName) {
    displayName = fullName;
  }

  await Promise.all([
    updateUserFullName(email, fullName),
    updateUserDisplayName(email, displayName),
    updateUserImage(email, imageUrl),
  ]);

  return { success: true };
}
