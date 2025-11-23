"use client";

import {
  type AppendMessage,
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePartPrimitive,
  MessagePrimitive,
  type TextMessagePartComponent,
  type ThreadMessageLike,
  ThreadPrimitive,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import { Plus } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

const THREAD_ID_PREFIX = "thread-";
const MESSAGE_ID_PREFIX = "msg-";
const MESSAGE_ID_SEPARATOR = "-";

type StoredThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

type StoredState = {
  threads: StoredThread[];
  messagesByThread: Record<string, ThreadMessageLike[]>;
};

const LS_KEY = "chatbot_threads_v1";

const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

function toPlainText(msg: ThreadMessageLike): string {
  const content = msg.content as any;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) => (p?.type === "text" ? p.text : ""))
      .filter(Boolean)
      .join("");
  }
  return "";
}

function buildTitleFromMessages(messages: ThreadMessageLike[]) {
  const firstUser = messages.find((m) => m.role === "user");
  const text = firstUser ? toPlainText(firstUser) : "Chat baru";
  return text.length > 40 ? text.slice(0, 40) + "…" : text || "Chat baru";
}

// IMPORTANT: gunakan literal "text" biar cocok sama union part type assistant-ui
const makeTextContent = (text: string) =>
  [{ type: "text" as const, text }] as const;

async function callChatBackendStreaming(
  history: ThreadMessageLike[],
  onDelta: (delta: string) => void,
) {
  const payloadMessages = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content: toPlainText(m),
    }));

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages: payloadMessages }),
  });

  const contentType = res.headers.get("content-type") || "";

  // fallback kalau backend balikin JSON biasa
  if (contentType.includes("application/json")) {
    const json = await res.json().catch(() => ({}));
    const text =
      json?.message ??
      json?.content ??
      json?.data?.message ??
      json?.data?.content ??
      "";
    if (text) onDelta(String(text));
    return;
  }

  // === SSE UI stream parser (toUIMessageStreamResponse()) ===
  const reader = res.body?.getReader();
  if (!reader) {
    const text = await res.text();
    if (text) onDelta(text);
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const dataStr = trimmed.replace(/^data:\s*/, "");
      if (dataStr === "[DONE]") continue;

      try {
        const evt = JSON.parse(dataStr);

        if (evt?.type === "text-delta" && typeof evt.delta === "string") {
          onDelta(evt.delta);
        }
      } catch {
        // ignore malformed chunk
      }
    }
  }
}

/**
 * Custom Text part renderer.
 * Karena MessagePrimitive.Parts tidak terima className/children,
 * styling text kita taruh di component Text ini.
 */
const TextPart: TextMessagePartComponent = () => {
  return (
    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
      {/* kalau mau markdown support (codeblock, list, dll) */}
      <MarkdownTextPrimitive />
      {/* atau kalau mau plain text:
          <MessagePartPrimitive.Text />
      */}
    </div>
  );
};

export default function ChatbotPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [threads, setThreads] = useState<StoredThread[]>([]);
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, ThreadMessageLike[]>
  >({});
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const convertMessage = useCallback(
    (message: ThreadMessageLike): ThreadMessageLike => message,
    [],
  );

  const generateThreadId = useCallback(
    () => `${THREAD_ID_PREFIX}${Date.now()}`,
    [],
  );

  const generateMessageId = useCallback(
    (role: string) =>
      `${MESSAGE_ID_PREFIX}${Date.now()}${MESSAGE_ID_SEPARATOR}${role}`,
    [],
  );

  // load local storage
  useEffect(() => {
    setIsMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredState;
      if (parsed?.threads?.length) {
        setThreads(parsed.threads);
        setMessagesByThread(parsed.messagesByThread || {});
        setCurrentThreadId(parsed.threads[0].id);
      }
    } catch (e) {
      console.warn("Failed to load chatbot local state:", e);
    }
  }, []);

  // persist local storage
  useEffect(() => {
    if (!isMounted) return;
    const state: StoredState = { threads, messagesByThread };
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [threads, messagesByThread, isMounted]);

  const DEFAULT_THREAD_TITLE = "Chat baru";
  const ERROR_MESSAGE =
    "Maaf, ada masalah saat menghubungkan ke server. Coba lagi ya.";

  const ensureThread = useCallback(() => {
    if (currentThreadId) return currentThreadId;

    const id = generateThreadId();
    const newThread: StoredThread = {
      id,
      title: DEFAULT_THREAD_TITLE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setThreads((prev) => [newThread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [id]: [] }));
    setCurrentThreadId(id);
    return id;
  }, [currentThreadId, generateThreadId]);

  const addMessageToThread = useCallback(
    (threadId: string, message: ThreadMessageLike) => {
      setMessagesByThread((prev) => {
        const current = prev[threadId] || [];
        return { ...prev, [threadId]: [...current, message] };
      });
    },
    [],
  );

  const updateThreadTitle = useCallback(
    (threadId: string, history: ThreadMessageLike[]) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                updatedAt: Date.now(),
                title:
                  t.title === DEFAULT_THREAD_TITLE || !t.title
                    ? buildTitleFromMessages(history)
                    : t.title,
              }
            : t,
        ),
      );
    },
    [],
  );

  const currentMessages = useMemo(
    () => (currentThreadId ? messagesByThread[currentThreadId] || [] : []),
    [messagesByThread, currentThreadId],
  );

  const updateMessageText = useCallback(
    (threadId: string, messageId: string, appendDelta: string) => {
      setMessagesByThread((prev) => {
        const current = prev[threadId] || [];
        const next: ThreadMessageLike[] = current.map((m) => {
          if (m.id !== messageId) return m;
          const prevText = toPlainText(m);
          return {
            ...m,
            content: makeTextContent(prevText + appendDelta),
          } satisfies ThreadMessageLike;
        });
        return { ...prev, [threadId]: next };
      });
    },
    [],
  );

  const onNew = useCallback(
    async (message: AppendMessage) => {
      const threadId = ensureThread();

      const userMessage: ThreadMessageLike = {
        id: generateMessageId("user"),
        role: "user",
        content: message.content,
        createdAt: new Date(),
      };

      addMessageToThread(threadId, userMessage);
      setIsRunning(true);

      // placeholder assistant
      const assistantId = generateMessageId("assistant");
      addMessageToThread(threadId, {
        id: assistantId,
        role: "assistant",
        content: makeTextContent(""),
        createdAt: new Date(),
      });

      try {
        const history = [...(messagesByThread[threadId] || []), userMessage];

        await callChatBackendStreaming(history, (delta) => {
          updateMessageText(threadId, assistantId, delta);
        });

        updateThreadTitle(threadId, [
          ...(messagesByThread[threadId] || []),
          userMessage,
        ]);
      } catch (err) {
        console.error("Chat backend error:", err);
        setMessagesByThread((prev) => {
          const current = prev[threadId] || [];
          const next: ThreadMessageLike[] = current.map((m) =>
            m.id === assistantId
              ? ({
                  ...m,
                  content: makeTextContent(ERROR_MESSAGE),
                } satisfies ThreadMessageLike)
              : m,
          );
          return { ...prev, [threadId]: next };
        });
      } finally {
        setIsRunning(false);
      }
    },
    [
      ensureThread,
      messagesByThread,
      generateMessageId,
      addMessageToThread,
      updateThreadTitle,
      updateMessageText,
    ],
  );

  const setCurrentMessages = useCallback(
    (messages: readonly ThreadMessageLike[]) => {
      if (!currentThreadId) return;
      setMessagesByThread((prev) => ({
        ...prev,
        [currentThreadId]: [...messages],
      }));
    },
    [currentThreadId],
  );

  const runtime = useExternalStoreRuntime({
    messages: currentMessages,
    isRunning,
    setMessages: setCurrentMessages,
    onNew,
    convertMessage,
  });

  const handleNewThread = useCallback(() => {
    const id = generateThreadId();
    const newThread: StoredThread = {
      id,
      title: DEFAULT_THREAD_TITLE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [id]: [] }));
    setCurrentThreadId(id);
  }, [generateThreadId]);

  const handleSelectThread = useCallback(
    (id: string) => setCurrentThreadId(id),
    [],
  );

  const handleDeleteThread = useCallback(
    (id: string) => {
      setThreads((prev) => prev.filter((t) => t.id !== id));
      setMessagesByThread((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      if (currentThreadId === id) {
        const remaining = threads.find((t) => t.id !== id);
        setCurrentThreadId(remaining?.id ?? null);
      }
    },
    [currentThreadId, threads],
  );

  return (
    // pt-20 supaya gak ketiban HeroHeader yang fixed
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 pt-20">
      <Sidebar
        threads={threads}
        currentThreadId={currentThreadId}
        onNewThread={handleNewThread}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
      />

      <AssistantRuntimeProvider runtime={runtime}>
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Local header (di dalam area chat) */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/70 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="leading-tight">
                <p className="font-semibold text-sm">RantaiSkena Assistant</p>
              </div>
            </div>

            <button
              onClick={handleNewThread}
              className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 font-medium text-xs shadow-sm transition hover:bg-accent"
            >
              <Plus className="size-4" />
              Chat baru
            </button>
          </div>

          <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
            <ThreadPrimitive.Viewport className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6">
              <ThreadPrimitive.Empty>
                <div className="mx-auto mt-20 flex max-w-md flex-col items-center gap-3 text-center">
                  <h2 className="font-semibold text-lg">
                    Mulai ngobrol dengan Assistant
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Coba tanya beberapa hal berikut:
                  </p>

                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {Object.entries({
                      "📚 Teori Hak Cipta":
                        "Jelaskan perbedaan fundamental antara Hak Mekanis (Mechanical Rights) dan Hak Mengumumkan (Performing Rights) dalam ekosistem musik.",
                      "🏛️ Peran LMKN":
                        "Apa fungsi utama dan landasan hukum Lembaga Manajemen Kolektif Nasional (LMKN) di Indonesia?",
                      "⚖️ Pajak Profesi Seni":
                        "Bagaimana penerapan PPh 21 dan PPh 23 bagi musisi independen menurut regulasi perpajakan Indonesia?",
                      "🛂 Syarat Visa P-1":
                        "Apa saja kriteria legal 'Internationally Recognized' yang harus dipenuhi musisi untuk mendapatkan Visa P-1 Amerika Serikat?",
                    }).map(([key, value]) => (
                      <ThreadPrimitive.Suggestion
                        key={key}
                        prompt={value}
                        send
                        className="rounded-full border bg-background px-3 py-1.5 text-xs hover:bg-accent"
                      >
                        {key}
                      </ThreadPrimitive.Suggestion>
                    ))}
                  </div>
                </div>
              </ThreadPrimitive.Empty>

              <ThreadPrimitive.Messages
                components={{
                  UserMessage: () => (
                    <MessagePrimitive.Root className="mb-3 flex justify-end">
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow",
                          "whitespace-pre-wrap leading-relaxed",
                          // coklat tua buat user bubble
                          "bg-amber-800 text-white", // text warm white
                        )}
                      >
                        <MessagePrimitive.Parts
                          components={{ Text: TextPart }}
                        />
                      </div>
                    </MessagePrimitive.Root>
                  ),

                  AssistantMessage: () => (
                    <MessagePrimitive.Root className="mb-3 flex justify-start">
                      <div className="max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm shadow-sm">
                        <MessagePrimitive.Parts
                          components={{
                            Text: TextPart,
                            // kalau nanti ada tool UI, masukin ke sini:
                            // tools: { by_name: { ... }, Fallback: ... }
                          }}
                        />
                      </div>
                    </MessagePrimitive.Root>
                  ),
                }}
              />

              <ThreadPrimitive.ScrollToBottom className="mx-auto mt-2 w-fit rounded-full border bg-background px-3 py-1 text-xs shadow-sm hover:bg-accent" />
            </ThreadPrimitive.Viewport>

            {/* Composer */}
            <div className="border-t bg-background/80 px-3 py-3 backdrop-blur md:px-6">
              <ComposerPrimitive.Root className="flex items-end gap-2">
                <ComposerPrimitive.Input
                  placeholder="Tulis pesan…"
                  className="min-h-[44px] flex-1 resize-none rounded-2xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />

                <ThreadPrimitive.If running={false}>
                  <ComposerPrimitive.Send className="inline-flex h-11 items-center justify-center rounded-2xl bg-amber-800 px-4 font-semibold text-sm text-white shadow transition hover:bg-primary/90">
                    Kirim
                  </ComposerPrimitive.Send>
                </ThreadPrimitive.If>

                <ThreadPrimitive.If running>
                  <ComposerPrimitive.Cancel className="inline-flex h-11 items-center justify-center rounded-2xl border bg-background px-4 font-semibold text-sm shadow-sm transition hover:bg-accent">
                    Stop
                  </ComposerPrimitive.Cancel>
                </ThreadPrimitive.If>
              </ComposerPrimitive.Root>
            </div>
          </ThreadPrimitive.Root>
        </div>
      </AssistantRuntimeProvider>
    </div>
  );
}
