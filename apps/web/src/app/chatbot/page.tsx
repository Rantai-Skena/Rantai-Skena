"use client";

import { Menu, Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "./sidebar";

export default function ChatbotPage() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  // Scroll to bottom effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handler untuk submit pesan (Anda harus mengimplementasikannya)
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    addMessage(input, "user");
    setInput("");
    // TODO: Tambahkan logika respons bot di sini
    // Contoh: setTimeout(() => addMessage("Ini adalah respons bot.", "bot"), 500);
  };

  return (
    <>
      <HeroHeader />
      <main className="min-h-screen pt-18">
        <div className="flex min-h-[90vh]">
          {/* TOMBOL TOGGLE DIPINDAHKAN DI SINI, DI LUAR DARI MAIN CHAT */}
          {/* Diletakkan secara absolut (absolute) atau tetap (fixed) di sudut kiri atas agar selalu terlihat. */}
          {/* Jika ingin agar selalu terlihat di pojok, ubah ke 'fixed' */}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={`absolute top-18 bg-neutral-800 ${
              sidebarOpen ? "left-64 rounded-l-none" : "left-4"
            } z-20 transition-all duration-300`} // Sesuaikan top/left sesuai HeroHeader dan layout Anda
            aria-label={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {sidebarOpen && <Sidebar />}

          <main className="flex max-h-[90vh] flex-1 flex-col bg-transparent">
            {/* HEADER LAMA TELAH DIHAPUS/DIGANTI DENGAN TOMBOL DI ATAS */}

            <div
              ref={chatContainerRef}
              className="flex-1 space-y-6 overflow-y-auto p-14 pt-20" // Tambah padding-top jika tombol toggle berada di atas
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  } items-start gap-3`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl p-4 ${
                      // Tambah max-w agar pesan tidak terlalu lebar
                      msg.sender === "user"
                        ? "rounded-br-lg bg-[#D1F7E8]"
                        : "rounded-bl-lg bg-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-10 py-6 lg:px-24">
              <div className="mx-auto w-full">
                <form onSubmit={handleSend} className="relative h-16">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 text-gray-500"
                  >
                    <Paperclip />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Ask Anything"
                    autoComplete="off"
                    className="h-full w-full rounded-full border-2 border-black bg-gray-100 py-4 pr-16 pl-10 transition"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    size="icon"
                    type="submit" // Penting: Ubah ke type="submit"
                    className="-translate-y-1/2 absolute top-1/2 right-3 rounded-full bg-autumn-500 text-black transition-colors hover:bg-autumn-500/90 focus:outline-none"
                  >
                    <Send />
                  </Button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </main>
    </>
  );
}
