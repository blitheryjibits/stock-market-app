"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile.actions";
import { cloudinary } from "@/lib/cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  fullName?: string;
  displayName?: string;
  image?: string;
  email?: string;
}

interface ProfileFormValues {
  fullName: string;
  displayName: string;
  imageUrl: string;
}

export default function ProfileForm({
  fullName = "",
  displayName = "",
  image = "",
}: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName,
      displayName: displayName || fullName, // initial fallback only
      imageUrl: image,
    },
  });

  const imageUrl = watch("imageUrl");

  // Handle Cloudinary upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.loading("Uploading image…");

    try {
      const result = await cloudinary.uploader.upload(file);
      setValue("imageUrl", result.secure_url, { shouldDirty: true });
      toast.success("Profile image uploaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      toast.dismiss();
    }
  };

  // Submit handler with optimistic UI
  const onSubmit = handleSubmit((data) => {
    const prev = { ...data }; // snapshot for rollback

    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) =>
          formData.append(key, value),
        );

        const result = await updateProfile(formData);

        if (result?.success) {
          toast.success("Profile updated");
          router.refresh();
        } else {
          // rollback
          Object.entries(prev).forEach(([key, value]) =>
            setValue(key as keyof ProfileFormValues, value),
          );
          toast.error("Unable to update profile");
        }
      } catch (error) {
        // rollback
        Object.entries(prev).forEach(([key, value]) =>
          setValue(key as keyof ProfileFormValues, value),
        );
        toast.error("Profile update failed");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
        {/* Full Name */}
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="text-sm text-gray-300">
            Full Name
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            {...register("fullName")}
          />
        </div>

        {/* Display Name */}
        <div className="grid gap-2">
          <Label htmlFor="displayName" className="text-sm text-gray-300">
            Display Name
          </Label>
          <Input
            id="displayName"
            placeholder="Enter your display name"
            {...register("displayName")}
          />
        </div>

        {/* Profile Picture */}
        <div className="grid gap-2">
          <Label className="text-sm text-gray-300">Profile Picture</Label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-slate-950">
              {imageUrl ? (
                <Image
                  fill
                  src={imageUrl}
                  alt="Profile preview"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm uppercase text-gray-500">
                  Preview
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-100 transition hover:bg-white/10">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500">
                Use a square image for the best preview.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || isSubmitting}
        className="w-full yellow-btn"
      >
        {isPending ? "Saving…" : "Save Profile"}
      </Button>
    </form>
  );
}
