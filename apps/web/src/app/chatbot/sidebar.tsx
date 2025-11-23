"use client";

import { MessageSquareText, Plus, Trash2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type StoredThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export function Sidebar({
  threads,
  currentThreadId,
  onNewThread,
  onSelectThread,
  onDeleteThread,
}: {
  threads: StoredThread[];
  currentThreadId: string | null;
  onNewThread: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
}) {
  return (
    <aside className="hidden w-[280px] flex-col border-r bg-background/60 backdrop-blur md:flex">
      {/* Top */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <MessageSquareText className="size-5 text-amber-200" />
          </div>
          <div>
            <p className="font-semibold text-sm">Chats</p>
            <p className="text-muted-foreground text-xs">
              {threads.length} percakapan
            </p>
          </div>
        </div>

        <button
          onClick={onNewThread}
          className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1 font-medium text-xs shadow-sm transition hover:bg-accent"
        >
          <Plus className="size-3.5" />
          Baru
        </button>
      </div>

      {/* List */}
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
        {threads.length === 0 && (
          <div className="mt-6 px-3 text-muted-foreground text-xs">
            Belum ada chat. Klik <span className="font-semibold">Baru</span>{" "}
            untuk mulai.
          </div>
        )}

        {threads.map((t) => {
          const active = t.id === currentThreadId;
          return (
            <div
              key={t.id}
              className={cn(
                "group relative flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent",
              )}
              onClick={() => onSelectThread(t.id)}
            >
              <div
                className={cn(
                  "grid size-8 place-items-center rounded-lg border bg-background",
                  active && "border-primary/30",
                )}
              >
                <MessageSquareText className="size-4 text-amber-200" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">
                  {t.title || "Chat baru"}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {new Date(t.updatedAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteThread(t.id);
                }}
                className={cn(
                  "-translate-y-1/2 absolute top-1/2 right-2 rounded-lg p-1.5 text-muted-foreground opacity-0 transition",
                  "hover:bg-background hover:text-destructive group-hover:opacity-100",
                )}
                title="Hapus chat"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom hint */}
      <div className="border-t px-4 py-3 text-[11px] text-muted-foreground">
        Riwayat chat tersimpan di browser kamu.
      </div>
    </aside>
  );
}

export { Sidebar as default };
