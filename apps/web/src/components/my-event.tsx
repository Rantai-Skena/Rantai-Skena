// apps/web/src/components/my-event.tsx
"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type EventRow = {
  id: string;
  name: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  genres: string[] | null;
  description: string | null;
  isPublished: boolean;
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

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const statusLabel: Record<ApplicationRow["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

const statusColor: Record<ApplicationRow["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  completed: "bg-sky-500/10 text-sky-500 border-sky-500/20",
};

export default function MyEvent() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicationsFor, setLoadingApplicationsFor] = useState<
    string | null
  >(null);
  const [applicationsByEvent, setApplicationsByEvent] = useState<
    Record<string, ApplicationRow[]>
  >({});
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    startsAt: "",
    endsAt: "",
    genres: "",
    description: "",
  });

  useEffect(() => {
    void fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await fetch("/api/events", {
        credentials: "include",
      });
      const json = (await res.json()) as ApiResponse<EventRow[]>;
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to load events");
      }
      setEvents(json.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil daftar event");
    } finally {
      setLoading(false);
    }
  }

  async function fetchApplications(eventId: string) {
    // kalau sudah pernah di-load, cukup toggle expand aja
    if (applicationsByEvent[eventId]) {
      setExpandedEventId((prev) => (prev === eventId ? null : eventId));
      return;
    }

    try {
      setLoadingApplicationsFor(eventId);
      const res = await fetch(`/api/events/${eventId}/applications`, {
        credentials: "include",
      });
      const json = (await res.json()) as ApiResponse<ApplicationRow[]>;
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to load applications");
      }
      setApplicationsByEvent((prev) => ({
        ...prev,
        [eventId]: json.data!,
      }));
      setExpandedEventId(eventId);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil applications untuk event ini");
    } finally {
      setLoadingApplicationsFor(null);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.location || !form.startsAt) {
      toast.error("Nama event, lokasi, dan tanggal mulai wajib diisi");
      return;
    }

    try {
      setCreatingLoading(true);
      const body: any = {
        name: form.name,
        location: form.location,
        startsAt: form.startsAt,
        description: form.description || null,
        genres:
          form.genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean) || null,
      };
      if (form.endsAt) body.endsAt = form.endsAt;

      const res = await fetch("/api/events/manage", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as ApiResponse<EventRow>;
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Failed to create event");
      }

      setEvents((prev) => [json.data!, ...prev]);
      toast.success("Event berhasil dibuat");

      setForm({
        name: "",
        location: "",
        startsAt: "",
        endsAt: "",
        genres: "",
        description: "",
      });
      setCreating(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat event");
    } finally {
      setCreatingLoading(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Yakin ingin menghapus event ini?")) return;

    try {
      const res = await fetch(`/api/events/manage/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = (await res.json().catch(() => ({}))) as ApiResponse<null>;
      if (!res.ok || (json.success === false && json.error)) {
        throw new Error(json.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus event");
    }
  }

  async function handleUpdateApplicationStatus(
    eventId: string,
    appId: string,
    status: ApplicationRow["status"],
  ) {
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
      const res = await fetch(`/api/application/${appId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const json = (await res.json()) as ApiResponse<ApplicationRow>;
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update status");
      }

      toast.success("Status application diperbarui");
    } catch (err) {
      console.error(err);
      // rollback
      setApplicationsByEvent((prev) => ({
        ...prev,
        [eventId]: previous,
      }));
      toast.error("Gagal mengubah status application");
    }
  }

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
        <Button variant="destructive" onClick={() => setCreating((v) => !v)}>
          {creating ? "Tutup form" : "Buat event baru"}
        </Button>
      </div>

      {/* Form create event */}
      {creating && (
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

            <div className="flex justify-end gap-2 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreating(false);
                  setForm({
                    name: "",
                    location: "",
                    startsAt: "",
                    endsAt: "",
                    genres: "",
                    description: "",
                  });
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={creatingLoading}
              >
                {creatingLoading ? "Menyimpan..." : "Simpan event"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List events */}
      {loading ? (
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
                            </div>
                            {app.message && (
                              <p className="mb-2 text-xs">“{app.message}”</p>
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
