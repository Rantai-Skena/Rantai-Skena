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

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export default function MyMusic() {
  const [music, setMusic] = useState<MusicRow[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [musicForm, setMusicForm] = useState({
    title: "",
    spotifyUrl: "",
    youtubeUrl: "",
    otherUrl: "",
    coverUrl: "",
  });
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: "",
    caption: "",
  });

  const [savingMusic, setSavingMusic] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    void fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);

      const [musicData, galleryData] = await Promise.all([
        apiGet<MusicRow[]>("/music"),
        apiGet<GalleryRow[]>("/gallery"),
      ]);

      setMusic(musicData);
      setGallery(galleryData);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data musik / gallery");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMusic(e: React.FormEvent) {
    e.preventDefault();

    if (!musicForm.title) {
      toast.error("Title harus diisi");
      return;
    }

    try {
      setSavingMusic(true);

      const created = await apiPost<MusicRow, typeof musicForm>("/music", {
        title: musicForm.title,
        coverUrl: musicForm.coverUrl || "",
        spotifyUrl: musicForm.spotifyUrl || "",
        youtubeUrl: musicForm.youtubeUrl || "",
        otherUrl: musicForm.otherUrl || "",
      });

      setMusic((prev) => [created, ...prev]);
      setMusicForm({
        title: "",
        spotifyUrl: "",
        youtubeUrl: "",
        otherUrl: "",
        coverUrl: "",
      });

      toast.success("Music berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan music");
    } finally {
      setSavingMusic(false);
    }
  }

  async function handleCreateGallery(e: React.FormEvent) {
    e.preventDefault();

    if (!galleryForm.imageUrl) {
      toast.error("Image URL harus diisi");
      return;
    }

    try {
      setSavingGallery(true);

      const created = await apiPost<GalleryRow, typeof galleryForm>(
        "/gallery",
        {
          imageUrl: galleryForm.imageUrl,
          caption: galleryForm.caption || "",
        },
      );

      setGallery((prev) => [created, ...prev]);
      setGalleryForm({ imageUrl: "", caption: "" });

      toast.success("Foto gallery berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan gallery");
    } finally {
      setSavingGallery(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-xl">My Music & Gallery</h2>
        <p className="text-muted-foreground text-sm">
          Kelola track musik dan gallery foto untuk menampilkan portfolio
          band/karyamu.
        </p>
      </div>

      {/* Form tambah music */}
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
                setMusicForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Contoh: Single terbaru kamu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="music-spotify">Spotify URL</Label>
            <Input
              id="music-spotify"
              value={musicForm.spotifyUrl}
              onChange={(e) =>
                setMusicForm((f) => ({ ...f, spotifyUrl: e.target.value }))
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
                setMusicForm((f) => ({ ...f, youtubeUrl: e.target.value }))
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
                setMusicForm((f) => ({ ...f, otherUrl: e.target.value }))
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
                setMusicForm((f) => ({ ...f, coverUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setMusicForm({
                  title: "",
                  spotifyUrl: "",
                  youtubeUrl: "",
                  otherUrl: "",
                  coverUrl: "",
                })
              }
            >
              Reset
            </Button>
            <Button type="submit" variant="destructive" disabled={savingMusic}>
              {savingMusic ? "Menyimpan..." : "Simpan track"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Form tambah gallery */}
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
                setGalleryForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="gallery-caption">Caption (optional)</Label>
            <Input
              id="gallery-caption"
              value={galleryForm.caption}
              onChange={(e) =>
                setGalleryForm((f) => ({ ...f, caption: e.target.value }))
              }
              placeholder="Deskripsi singkat foto"
            />
          </div>

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setGalleryForm({
                  imageUrl: "",
                  caption: "",
                })
              }
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={savingGallery}
            >
              {savingGallery ? "Menyimpan..." : "Simpan foto"}
            </Button>
          </div>
        </form>
      </Card>

      {/* List music + gallery */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card className="border p-4" key={i}>
              <Skeleton className="mb-2 h-5 w-40" />
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Music list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">Tracks kamu</h3>
            {music.length === 0 ? (
              <Card className="border p-4 text-muted-foreground text-sm">
                Belum ada track. Tambahkan lagu pertama kamu.
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {music.map((m) => (
                  <Card key={m.id} className="flex gap-3 border p-3 sm:p-4">
                    {m.coverUrl ? (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-accent">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.coverUrl}
                          alt={m.title}
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
                        <div className="font-medium text-sm">{m.title}</div>
                        <Badge variant="outline" className="text-[11px]">
                          Track
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        {m.spotifyUrl && (
                          <a
                            href={m.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            Spotify
                          </a>
                        )}
                        {m.youtubeUrl && (
                          <a
                            href={m.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            YouTube
                          </a>
                        )}
                        {m.otherUrl && (
                          <a
                            href={m.otherUrl}
                            target="_blank"
                            rel="noreferrer"
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
              <Card className="border p-4 text-muted-foreground text-sm">
                Belum ada foto di gallery.
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {gallery.map((g) => (
                  <Card key={g.id} className="overflow-hidden border p-2">
                    <div className="mb-2 h-32 w-full overflow-hidden rounded-md bg-accent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.imageUrl}
                        alt={g.caption ?? "Gallery image"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {g.caption && (
                      <p className="text-muted-foreground text-xs">
                        {g.caption}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
