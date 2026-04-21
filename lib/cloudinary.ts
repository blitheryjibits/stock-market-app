export type CloudinaryUploadResult = {
  secure_url: string;
};

export const cloudinary = {
  uploader: {
    upload: async (file: File): Promise<CloudinaryUploadResult> => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary environment variables are required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
        );
      }

      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      body.append("folder", "stock-market-app/profiles");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body,
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Cloudinary upload failed: ${text}`);
      }

      return response.json();
    },
  },
};
