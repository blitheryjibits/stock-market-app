import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import ProfileForm from "@/components/forms/ProfileForm";
import { connectToDatabase } from "@/database/mongoose";
import { UserProfile } from "@/database/models/userProfile.model";
import Image from "next/image";

export const metadata = {
  title: "Profile",
  description: "Edit your user profile and update your profile picture.",
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/sign-in");
  }

  await connectToDatabase();
  let profile = await UserProfile.findOne({ userId: session.user.id });

  if (!profile) {
    profile = await UserProfile.create({
      userId: session.user.id,
      displayName: "",
      image: "",
      updatedAt: new Date(),
      settings: {},
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950/90 p-4 md:p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="">
          {/* LEFT SIDE — Avatar + Heading */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900">
                {profile.image ? (
                  <Image
                    fill
                    src={profile.image}
                    alt="Profile picture"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-gray-500">
                    {session.user.name?.[0] ?? ""}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                <p className="text-sm text-gray-400">
                  Update your personal information and profile picture.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — The Form (single source of truth) */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
            <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
            <p className="mt-2 text-sm text-gray-400">
              Make changes and save to update your account.
            </p>

            <div className="mt-8">
              <ProfileForm
                email={session.user.email}
                fullName={session.user.name}
                displayName={profile.displayName}
                image={profile.image}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
