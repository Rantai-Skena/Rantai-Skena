"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { uploadImage } from "@/lib/upload-image";

type EventRow = {
  id: string;
  name: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  genres: string[] | null;
  description: string | null;
  isPublished: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApplicationRow = {
  id: string;
  status: "pending" | "approved" | "rejected" | "completed";
  message: string | null;
  createdAt: string;
  artistId: string;
  artistName: string | null;
  artistEmail: string | null;
};

const statusLabel: Record<ApplicationRow["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
} as const;

const statusColor: Record<ApplicationRow["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  completed: "bg-sky-500/10 text-sky-500 border-sky-500/20",
} as const;

export default function MyEvent() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingApplicationsFor, setLoadingApplicationsFor] = useState<
    string | null
  >(null);
  const [applicationsByEvent, setApplicationsByEvent] = useState<
    Record<string, ApplicationRow[]>
  >({});
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingLoading, setIsCreatingLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    startsAt: "",
    endsAt: "",
    genres: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    void fetchEvents();
  }, []);

  const fetchEvents = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await apiGet<EventRow[]>("/agent/events");
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Gagal mengambil daftar event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    try {
      setIsImageUploading(true);
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Gagal upload gambar");
    } finally {
      setIsImageUploading(false);
    }
  };

  const fetchApplications = async (eventId: string): Promise<void> => {
    if (applicationsByEvent[eventId]) {
      setExpandedEventId((prev) => (prev === eventId ? null : eventId));
      return;
    }

    try {
      setLoadingApplicationsFor(eventId);
      const data = await apiGet<ApplicationRow[]>(
        `/agent/events/${eventId}/applications`,
      );
      setApplicationsByEvent((prev) => ({
        ...prev,
        [eventId]: data,
      }));
      setExpandedEventId(eventId);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Gagal mengambil applications untuk event ini");
    } finally {
      setLoadingApplicationsFor(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!form.name || !form.location || !form.startsAt) {
      toast.error("Nama event, lokasi, dan tanggal mulai wajib diisi");
      return;
    }

    try {
      setIsCreatingLoading(true);
      const body: Record<string, unknown> = {
        name: form.name,
        location: form.location,
        startsAt: form.startsAt,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        genres:
          form.genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean) || null,
      };
      if (form.endsAt) {
        body.endsAt = form.endsAt;
      }

      const newEvent = await apiPost<EventRow, Record<string, unknown>>(
        "/agent/events",
        body,
      );

      setEvents((prev) => [newEvent, ...prev]);
      toast.success("Event berhasil dibuat");

      setForm({
        name: "",
        location: "",
        startsAt: "",
        endsAt: "",
        genres: "",
        description: "",
        imageUrl: "",
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Gagal membuat event");
    } finally {
      setIsCreatingLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string): Promise<void> => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;

    try {
      await apiDelete(`/agent/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event berhasil dihapus");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Gagal menghapus event");
    }
  };

  const handleUpdateApplicationStatus = async (
    eventId: string,
    appId: string,
    status: ApplicationRow["status"],
  ): Promise<void> => {
    const current = applicationsByEvent[eventId];
    if (!current) return;

    const previous = [...current];

    // optimistic update
    setApplicationsByEvent((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((a) =>
        a.id === appId ? { ...a, status } : a,
      ),
    }));

    try {
      await apiPatch<ApplicationRow, { status: ApplicationRow["status"] }>(
        `/agent/applications/${appId}/status`,
        { status },
      );

      toast.success("Status application diperbarui");
    } catch (error) {
      console.error("Failed to update application status:", error);
      // rollback
      setApplicationsByEvent((prev) => ({
        ...prev,
        [eventId]: previous,
      }));
      toast.error("Gagal mengubah status application");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + tombol tambah */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-xl">My Events</h2>
          <p className="text-muted-foreground text-sm">
            Kelola event yang kamu buat sebagai agent dan review aplikasi yang
            masuk.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setIsCreating((v) => !v)}>
          {isCreating ? "Tutup form" : "Buat event baru"}
        </Button>
      </div>

      {/* Form create event */}
      {isCreating && (
        <Card className="border p-4 sm:p-6">
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleCreateEvent}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Contoh: Friday Night Indie Showcase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="Contoh: M Bloc Space, Jakarta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startsAt">Starts At</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startsAt: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endsAt">Ends At (optional)</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endsAt: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genres">Genres (comma separated)</Label>
              <Input
                id="genres"
                value={form.genres}
                onChange={(e) =>
                  setForm((f) => ({ ...f, genres: e.target.value }))
                }
                placeholder="rock, indie, alternative"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Singkat tentang event ini"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Event Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isImageUploading}
              />
              {isImageUploading && (
                <p className="text-muted-foreground text-xs">Uploading...</p>
              )}
              {form.imageUrl && (
                <div className="mt-2">
                  <img
                    src={form.imageUrl}
                    alt="Event preview"
                    className="h-32 w-48 rounded-md border object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-destructive"
                    onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                  >
                    Hapus gambar
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setForm({
                    name: "",
                    location: "",
                    startsAt: "",
                    endsAt: "",
                    genres: "",
                    description: "",
                    imageUrl: "",
                  });
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isCreatingLoading || isImageUploading}
              >
                {isCreatingLoading ? "Menyimpan..." : "Simpan event"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List events */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card className="border p-4" key={i}>
              <Skeleton className="mb-3 h-5 w-40" />
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="border p-6 text-center text-muted-foreground text-sm">
          Belum ada event. Mulai dengan membuat event pertamamu.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => {
            const starts = new Date(event.startsAt);
            const ends = event.endsAt ? new Date(event.endsAt) : null;

            return (
              <Card
                key={event.id}
                className="flex flex-col gap-3 border p-4 sm:p-5"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="h-32 w-full rounded-md object-cover"
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">
                      {event.name}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {event.location}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      event.isPublished
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                        : "border-muted bg-transparent text-muted-foreground"
                    }
                  >
                    {event.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="space-y-1 text-muted-foreground text-xs sm:text-sm">
                  <p>
                    {format(starts, "dd MMM yyyy HH:mm")}
                    {ends && <> - {format(ends, "dd MMM yyyy HH:mm")}</>}
                  </p>
                  {event.genres && event.genres.length > 0 && (
                    <p>
                      Genre:{" "}
                      <span className="font-medium">
                        {event.genres.join(", ")}
                      </span>
                    </p>
                  )}
                  {event.description && (
                    <p className="line-clamp-2">{event.description}</p>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchApplications(event.id)}
                    disabled={loadingApplicationsFor === event.id}
                  >
                    {loadingApplicationsFor === event.id
                      ? "Loading..."
                      : expandedEventId === event.id
                        ? "Sembunyikan Applications"
                        : "Lihat Applications"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Hapus
                  </Button>
                </div>

                {/* Applications */}
                {expandedEventId === event.id && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="mb-2 font-medium text-sm">Applications</h4>
                    {!applicationsByEvent[event.id] ? (
                      <p className="text-muted-foreground text-xs">
                        Belum ada data.
                      </p>
                    ) : applicationsByEvent[event.id].length === 0 ? (
                      <p className="text-muted-foreground text-xs">
                        Belum ada artist yang apply untuk event ini.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {applicationsByEvent[event.id].map((app) => (
                          <div
                            key={app.id}
                            className="rounded-md border bg-muted/40 p-3 text-xs sm:text-sm"
                          >
                            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                              <Link href={`/explore-artists/${app.artistId}`}>
                                <div>
                                  <div className="font-medium">
                                    {app.artistName ?? "Unknown artist"}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {app.artistEmail}
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={statusColor[app.status]}
                                >
                                  {statusLabel[app.status]}
                                </Badge>
                              </Link>
                            </div>
                            {app.message && (
                              <p className="mb-2 text-xs">"{app.message}"</p>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] text-muted-foreground">
                                {format(
                                  new Date(app.createdAt),
                                  "dd MMM yyyy HH:mm",
                                )}
                              </span>

                              <div className="ml-auto flex flex-wrap gap-2">
                                {(
                                  [
                                    "pending",
                                    "approved",
                                    "rejected",
                                    "completed",
                                  ] as const
                                ).map((st) => (
                                  <Button
                                    key={st}
                                    size="sm"
                                    variant={
                                      app.status === st
                                        ? "destructive"
                                        : "outline"
                                    }
                                    className="text-[11px]"
                                    onClick={() =>
                                      handleUpdateApplicationStatus(
                                        event.id,
                                        app.id,
                                        st,
                                      )
                                    }
                                    disabled={app.status === st}
                                  >
                                    {statusLabel[st]}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
