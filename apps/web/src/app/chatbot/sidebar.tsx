"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [chatTitles, setChatTitles] = useState([]);

  return (
    <aside className="relative z-10 flex min-h-full w-64 flex-col bg-neutral-800 px-6 py-8 shadow-xl transition-all duration-300 ease-in-out">
      <nav className="grow space-y-9 overflow-y-auto">
        {chatTitles.map((text, idx) => (
          <Link
            key={idx}
            href="/chatbot"
            className="mb-3 flex h-8 w-full items-center justify-center rounded-lg bg-gradient-primary p-px"
          >
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white px-3 hover:bg-gray-100">
              <h1 className="text-center">{text}</h1>
            </div>
          </Link>
        ))}
      </nav>
      <button className="mb-4 flex w-full items-center justify-center rounded-lg bg-autumn-500 px-3 py-2 transition-colors active:bg-[#1a6e6a]">
        <span className="sidebar-text text-center">New Chat</span>
      </button>
    </aside>
  );
}
