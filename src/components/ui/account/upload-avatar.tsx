"use client";

import { Spinner } from "@/components/atom/spinner";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UploadAvatar() {
  const { data: session, update } = useSession();

  const [image, setImage] = useState<string | null>();

  useEffect(() => {
    setImage(
      session?.user?.image ||
        (session?.user?.email
          ? `https://api.dicebear.com/8.x/initials/svg?seed=${session?.user?.email}`
          : null),
    );
  }, [session]);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 2) {
          toast.error("File size too big (max 2MB)");
        } else if (file.type !== "image/png" && file.type !== "image/jpeg") {
          toast.error("File type not supported (.png or .jpg only)");
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setImage],
  );

  const [uploading, setUploading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        setUploading(true);
        e.preventDefault();
        fetch("/api/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image }),
        }).then(async (res) => {
          setUploading(false);
          if (res.status === 200) {
            await update();
            toast.success("Successfully updated your profile picture!");
          } else {
            const errorMessage = await res.text();
            toast.error(errorMessage || "Something went wrong");
          }
        });
      }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">Your Avatar</h2>
        <p className="text-secondary-foreground/700 text-sm">
          This is your avatar image on {process.env.NEXT_PUBLIC_APP_NAME}.
        </p>
        <div>
          <label
            htmlFor="image"
            className="group relative mt-1 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:bg-gray-50"
          >
            <div
              className="absolute z-[5] h-full w-full rounded-full"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                const file = e.dataTransfer.files && e.dataTransfer.files[0];
                if (file) {
                  if (file.size / 1024 / 1024 > 2) {
                    toast.error("File size too big (max 2MB)");
                  } else if (
                    file.type !== "image/png" &&
                    file.type !== "image/jpeg"
                  ) {
                    toast.error("File type not supported (.png or .jpg only)");
                  } else {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
            />
            <div
              className={`${
                dragActive
                  ? "cursor-copy border-2 border-border bg-accent/20 opacity-100"
                  : ""
              } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-full bg-card transition-all ${
                image
                  ? "opacity-0 group-hover:opacity-100"
                  : "group-hover:bg-accent/20"
              }`}
            >
              <UploadCloud
                className={`${
                  dragActive ? "scale-110" : "scale-100"
                } text-secondary-foreground/700 h-5 w-5 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              />
            </div>
            {image && (
              <Image
                src={image}
                alt="Preview"
                className="h-full w-full rounded-full object-cover"
                height={96}
                width={96}
                unoptimized
              />
            )}
          </label>
          <div className="mt-1 flex rounded-full shadow-sm">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onChangePicture}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-border bg-accent/20 p-3 sm:px-10">
        <p className="text-sm text-muted-foreground">
          Square image recommended. Accepted file types: .png, .jpg. Max file
          size: 2MB.
        </p>
        <div className="shrink-0">
          <Button disabled={!image || session?.user?.image === image}>
            {uploading ? <Spinner /> : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
