"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export async function generateAvatarUrl(name: string) {
  const letter = encodeURIComponent(name?.charAt(0)?.toUpperCase() || "U");
  return `https://res.cloudinary.com/<your_cloud_name>/image/upload/w_256,h_256,c_fill,r_max,b_rgb:4F46E5,co_rgb:FFFFFF,l_text:Arial_140_b:${letter}/avatar.png`;
}

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const avatarUrl = await generateAvatarUrl(fullName);
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName, image: avatarUrl },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (e) {
    console.log("Sign up failed", e);
    return { success: false, error: "Sign up failed" };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });

    return { success: true, data: response };
  } catch (e) {
    console.log("Sign in failed", e);
    return { success: false, error: "Sign in failed" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log("Sign out failed", e);
    return { success: false, error: "Sign out failed" };
  }
};
