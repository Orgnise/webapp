import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = (file: File) => {
  const base64 = FileToBase64(file);
  // const promise = fetch("/api/upload", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-vercel-filename": file?.name || "image.png",
  //   },
  //   body: file,
  // });



  return Promise.resolve(base64).then(async (base64) => {
    return new Promise((resolve) => {
      toast.promise(
        fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64, filename: file?.name, path: "images" }),
        }).then(async (res) => {
          // Successfully uploaded image
          if (res.status === 200) {
            const { url } = (await res.json()) as any;
            console.log(url);
            // preload the image
            let image = new Image();
            image.src = url;
            image.onload = () => {
              resolve(url);
            };
            // No blob store configured
          } else if (res.status === 401) {
            resolve(file);
            throw new Error(
              "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.",
            );
            // Unknown error
          } else {
            throw new Error(`Error uploading image. Please try again.`);
          }
        }),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully.",
          error: (e) => e.message,
        },
      );
    });
  });

  // return Promise.all([base64, uploadFile]).then(([base64, url]) => url);
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});

export const FileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });