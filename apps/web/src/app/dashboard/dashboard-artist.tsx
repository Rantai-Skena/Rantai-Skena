"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { authClient } from "@/lib/auth-client";
import { HeroHeader } from "../../components/header";
import MyApplication from "../../components/my-application";
import MyMusic from "../../components/my-music";
import Schedule from "../../components/schedule";

type ArtistProfile = {
  id: string;
  userId: string;
  stageName: string;
  city: string | null;
  genre: string | null;
  bio: string | null;
  instagram: string | null;
  spotify: string | null;
  youtube: string | null;
  imageUrl: string | null;
};

export default function DashboardArtist({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const privateData = session.user;
  const [activeTab, setActiveTab] = useState("My Music");

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const tabs = [
    { id: "My Music", label: "My Music" },
    { id: "Performance Schedule", label: "Performance Schedule" },
    { id: "My Applications", label: "My Applications" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        if (!baseUrl) return;

        const res = await fetch(`${baseUrl}/api/artist/profile`, {
          method: "GET",
          credentials: "include",
        });

        const json = (await res.json()) as {
          success?: boolean;
          data?: ArtistProfile | null;
        };

        if (res.ok && json.success) {
          setProfile(json.data ?? null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!baseUrl) {
      toast.error("Server URL belum dikonfigurasi");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingAvatar(true);
    try {
      // 1) Upload ke Cloudinary via backend
      const uploadRes = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const uploadJson = (await uploadRes.json()) as {
        success?: boolean;
        url?: string;
        error?: string;
      };

      if (!uploadRes.ok || !uploadJson.success || !uploadJson.url) {
        throw new Error(uploadJson.error ?? "Gagal upload gambar");
      }

      const imageUrl = uploadJson.url;

      // 2) Simpan URL-nya ke artist profile
      const payload = {
        stageName: profile?.stageName ?? privateData.name,
        city: profile?.city ?? "",
        genre: profile?.genre ?? "",
        bio: profile?.bio ?? "",
        instagram: profile?.instagram ?? "",
        spotify: profile?.spotify ?? "",
        youtube: profile?.youtube ?? "",
        imageUrl, // 👈 field baru
      };

      const res = await fetch(`${baseUrl}/api/artist/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Gagal menyimpan foto band");
      }

      setProfile((prev) => (prev ? { ...prev, imageUrl } : prev));
      toast.success("Foto band berhasil diperbarui");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Terjadi kesalahan saat upload foto");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <HeroHeader />
      <div className="flex min-h-screen w-full bg-background pt-20">
        <aside className="flex w-fit flex-col items-center gap-4 bg-card p-6 shadow-xl">
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="relative">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-gradient-artist">
                {profile?.imageUrl ? (
                  <Image
                    src={profile.imageUrl}
                    alt={`${privateData.name} band photo`}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-4 text-center text-white/80 text-xs">
                    Upload your band photo
                  </span>
                )}
              </div>

              {/* tombol edit */}
              <label
                htmlFor="band-avatar-upload"
                className="absolute right-2 bottom-2 cursor-pointer rounded-full bg-black/70 px-3 py-1 text-white text-xs shadow-sm"
              >
                {isUploadingAvatar ? "Uploading..." : "Edit"}
              </label>
              <input
                id="band-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-h4">{privateData.name}</h1>
              <h5 className="text-bodyLarge">{privateData.email}</h5>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "artistOutline" : "ghost"}
              >
                <span
                  className={`font-medium text-base ${activeTab !== tab.id ? "text-white" : "bg-gradient-artist bg-clip-text text-transparent"}`}
                >
                  {tab.label}
                </span>
              </Button>
            ))}
          </nav>
        </aside>

        <main className="flex min-h-screen grow overflow-y-auto bg-card p-6">
          {activeTab === "My Music" && <MyMusic />}
          {activeTab === "Performance Schedule" && (
            <Schedule variant="artist" />
          )}
          {activeTab === "My Applications" && <MyApplication />}
        </main>
      </div>
    </>
  );
}
