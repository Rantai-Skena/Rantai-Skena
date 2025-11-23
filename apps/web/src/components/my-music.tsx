"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, apiPost } from "@/lib/api-client";

type MusicRow = {
  id: string;
  title: string;
  coverUrl: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  otherUrl: string | null;
  createdAt: string;
};

type GalleryRow = {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
};

const EMPTY_MUSIC_FORM = {
  title: "",
  spotifyUrl: "",
  youtubeUrl: "",
  otherUrl: "",
  coverUrl: "",
};

const EMPTY_GALLERY_FORM = {
  imageUrl: "",
  caption: "",
};

export default function MyMusic() {
  const [music, setMusic] = useState<MusicRow[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [musicForm, setMusicForm] = useState(EMPTY_MUSIC_FORM);
  const [galleryForm, setGalleryForm] = useState(EMPTY_GALLERY_FORM);

  const [isCreatingMusic, setIsCreatingMusic] = useState(false);
  const [isCreatingGallery, setIsCreatingGallery] = useState(false);
  const [isSavingMusic, setIsSavingMusic] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    void fetchAll();
  }, []);

  const fetchAll = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const [musicData, galleryData] = await Promise.all([
        apiGet<MusicRow[]>("/music"),
        apiGet<GalleryRow[]>("/gallery"),
      ]);

      setMusic(musicData);
      setGallery(galleryData);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch music/gallery:", error);
      }
      toast.error("Gagal mengambil data musik / gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMusic = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!musicForm.title) {
      toast.error("Title harus diisi");
      return;
    }

    try {
      setIsSavingMusic(true);

      const created = await apiPost<MusicRow, typeof musicForm>("/music", {
        title: musicForm.title,
        coverUrl: musicForm.coverUrl || "",
        spotifyUrl: musicForm.spotifyUrl || "",
        youtubeUrl: musicForm.youtubeUrl || "",
        otherUrl: musicForm.otherUrl || "",
      });

      setMusic((previousMusic) => [created, ...previousMusic]);
      setMusicForm(EMPTY_MUSIC_FORM);
      setIsCreatingMusic(false);

      toast.success("Track berhasil ditambahkan");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to create music:", error);
      }
      toast.error("Gagal menyimpan track");
    } finally {
      setIsSavingMusic(false);
    }
  };

  const handleCreateGallery = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!galleryForm.imageUrl) {
      toast.error("Image URL harus diisi");
      return;
    }

    try {
      setIsSavingGallery(true);

      const created = await apiPost<GalleryRow, typeof galleryForm>(
        "/gallery",
        {
          imageUrl: galleryForm.imageUrl,
          caption: galleryForm.caption || "",
        },
      );

      setGallery((previousGallery) => [created, ...previousGallery]);
      setGalleryForm(EMPTY_GALLERY_FORM);
      setIsCreatingGallery(false);

      toast.success("Foto gallery berhasil ditambahkan");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to create gallery:", error);
      }
      toast.error("Gagal menyimpan gallery");
    } finally {
      setIsSavingGallery(false);
    }
  };

  const resetMusicForm = (): void => {
    setMusicForm(EMPTY_MUSIC_FORM);
    setIsCreatingMusic(false);
  };

  const resetGalleryForm = (): void => {
    setGalleryForm(EMPTY_GALLERY_FORM);
    setIsCreatingGallery(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-xl">My Music & Gallery</h2>
          <p className="text-muted-foreground text-sm">
            Kelola track musik dan gallery foto untuk menampilkan portfolio
            band/karyamu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            onClick={() => setIsCreatingMusic((previous) => !previous)}
          >
            {isCreatingMusic ? "Tutup form" : "Tambah track"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCreatingGallery((previous) => !previous)}
          >
            {isCreatingGallery ? "Tutup form" : "Tambah foto"}
          </Button>
        </div>
      </div>

      {/* Form tambah music */}
      {isCreatingMusic && (
        <Card className="border p-4 sm:p-6">
          <h3 className="mb-3 font-semibold text-sm sm:text-base">
            Tambah Track Baru
          </h3>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleCreateMusic}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="music-title">Title</Label>
              <Input
                id="music-title"
                value={musicForm.title}
                onChange={(e) =>
                  setMusicForm((form) => ({ ...form, title: e.target.value }))
                }
                placeholder="Contoh: Single terbaru kamu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="music-spotify">Spotify URL</Label>
              <Input
                id="music-spotify"
                value={musicForm.spotifyUrl}
                onChange={(e) =>
                  setMusicForm((form) => ({
                    ...form,
                    spotifyUrl: e.target.value,
                  }))
                }
                placeholder="https://open.spotify.com/track/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="music-youtube">YouTube URL</Label>
              <Input
                id="music-youtube"
                value={musicForm.youtubeUrl}
                onChange={(e) =>
                  setMusicForm((form) => ({
                    ...form,
                    youtubeUrl: e.target.value,
                  }))
                }
                placeholder="https://youtu.be/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="music-other">Other URL (SoundCloud, dst.)</Label>
              <Input
                id="music-other"
                value={musicForm.otherUrl}
                onChange={(e) =>
                  setMusicForm((form) => ({
                    ...form,
                    otherUrl: e.target.value,
                  }))
                }
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="music-cover">Cover Image URL (optional)</Label>
              <Input
                id="music-cover"
                value={musicForm.coverUrl}
                onChange={(e) =>
                  setMusicForm((form) => ({
                    ...form,
                    coverUrl: e.target.value,
                  }))
                }
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end gap-2 md:col-span-2">
              <Button type="button" variant="outline" onClick={resetMusicForm}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSavingMusic}
              >
                {isSavingMusic ? "Menyimpan..." : "Simpan track"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Form tambah gallery */}
      {isCreatingGallery && (
        <Card className="border p-4 sm:p-6">
          <h3 className="mb-3 font-semibold text-sm sm:text-base">
            Tambah Foto Gallery
          </h3>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleCreateGallery}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gallery-image">Image URL</Label>
              <Input
                id="gallery-image"
                value={galleryForm.imageUrl}
                onChange={(e) =>
                  setGalleryForm((form) => ({
                    ...form,
                    imageUrl: e.target.value,
                  }))
                }
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gallery-caption">Caption (optional)</Label>
              <Input
                id="gallery-caption"
                value={galleryForm.caption}
                onChange={(e) =>
                  setGalleryForm((form) => ({
                    ...form,
                    caption: e.target.value,
                  }))
                }
                placeholder="Deskripsi singkat foto"
              />
            </div>

            <div className="flex justify-end gap-2 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetGalleryForm}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSavingGallery}
              >
                {isSavingGallery ? "Menyimpan..." : "Simpan foto"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Content sections */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card className="border p-4" key={index}>
              <Skeleton className="mb-2 h-5 w-40" />
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Music list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">Tracks kamu</h3>
            {music.length === 0 ? (
              <Card className="border p-6 text-center text-muted-foreground text-sm">
                Belum ada track. Tambahkan lagu pertama kamu.
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {music.map((musicTrack) => (
                  <Card
                    key={musicTrack.id}
                    className="flex gap-3 border p-3 sm:p-4"
                  >
                    {musicTrack.coverUrl ? (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-accent">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={musicTrack.coverUrl}
                          alt={`${musicTrack.title} cover`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-accent font-medium text-xs">
                        No Cover
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm">
                          {musicTrack.title}
                        </div>
                        <Badge variant="outline" className="text-[11px]">
                          Track
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        {musicTrack.spotifyUrl && (
                          <a
                            href={musicTrack.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            Spotify
                          </a>
                        )}
                        {musicTrack.youtubeUrl && (
                          <a
                            href={musicTrack.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            YouTube
                          </a>
                        )}
                        {musicTrack.otherUrl && (
                          <a
                            href={musicTrack.otherUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            Link lain
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Gallery list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">
              Photo Gallery
            </h3>
            {gallery.length === 0 ? (
              <Card className="border p-6 text-center text-muted-foreground text-sm">
                Belum ada foto di gallery.
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {gallery.map((galleryItem) => (
                  <Card
                    key={galleryItem.id}
                    className="overflow-hidden border p-2"
                  >
                    <div className="mb-2 h-32 w-full overflow-hidden rounded-md bg-accent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={galleryItem.imageUrl}
                        alt={galleryItem.caption ?? "Gallery image"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {galleryItem.caption && (
                      <p className="text-muted-foreground text-xs">
                        {galleryItem.caption}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
