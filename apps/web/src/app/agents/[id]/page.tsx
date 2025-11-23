import { Clock, Instagram, Mail, MapPin } from "lucide-react";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EventData {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  genres: string[];
}

const dummyEvents: EventData[] = [
  {
    id: 1,
    name: "Rock the City",
    location: "Stadion Gelora",
    date: "25 Nov 2025",
    time: "19:00 WIB",
    genres: ["Rock", "Metalcore"],
  },
  {
    id: 2,
    name: "Indie Sunset",
    location: "Taman Kota",
    date: "10 Des 2025",
    time: "16:00 WIB",
    genres: ["Indie", "Pop"],
  },
  {
    id: 3,
    name: "Jazz & Blues Night",
    location: "Cafe 1945",
    date: "05 Jan 2026",
    time: "20:30 WIB",
    genres: ["Jazz", "R&B"],
  },
  {
    id: 4,
    name: "EDM Festival X",
    location: "Ancol Beach",
    date: "14 Feb 2026",
    time: "22:00 WIB",
    genres: ["EDM", "HipHop"],
  },
  {
    id: 5,
    name: "Punk Revival",
    location: "Gedung Serba Guna",
    date: "01 Mar 2026",
    time: "18:00 WIB",
    genres: ["Punk", "Hardcore"],
  },
  {
    id: 6,
    name: "Emo & Hardcore Fest",
    location: "Klub Bawah Tanah",
    date: "15 Mar 2026",
    time: "17:30 WIB",
    genres: ["Emo", "Hardcore"],
  },
];
const InfoItem = ({
  Icon,
  text,
}: {
  Icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-3">
    <Icon className="h-5 w-5 text-gray-500" />
    <p className="text-base text-gray-500">{text}</p>
  </div>
);

export default function EventDetail() {
  return (
    <>
      <HeroHeader />
      <main className="mx-auto min-h-screen max-w-7xl p-8 md:p-12 lg:p-20">
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-video h-full rounded-xl bg-gray-200 lg:aspect-5/4" />

          <div className="flex flex-col gap-6">
            <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
              NAMAEVENT
            </h1>

            <h2 className="font-medium text-xl">NAMAAGENT</h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-gradient-artist bg-card px-2 py-0.5 font-medium text-xs">
                <span className="bg-gradient-artist bg-clip-text text-transparent">
                  Pop
                </span>
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem Icon={MapPin} text="Jakarta" />
                <InfoItem Icon={Clock} text="20:00 WIB - 22:00 WIB" />
                <InfoItem Icon={Instagram} text="@enthufest" />
                <InfoItem Icon={Mail} text="enthufest@gmail.com" />
              </div>
            </div>

            <div className="space-x-4">
              <Button variant="artist">Apply</Button>
              <Button variant="artistOutline">Contact</Button>
            </div>
          </div>
        </section>

        <hr className="my-10" />

        <section className="flex flex-col gap-8">
          <h2 className="font-bold text-h4">More events by this agent</h2>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {dummyEvents.map((event) => (
              <div
                key={event.id}
                className="w-full min-w-[300px] max-w-xs shrink-0 rounded-2xl border bg-card p-4 shadow-xl transition-all duration-300 hover:border-sky-500 hover:shadow-[0_0_25px_rgba(31,154,255,0.35)] sm:p-5"
              >
                <div className="mb-4 aspect-video h-auto w-full rounded-xl bg-zinc-300" />
                <div className="flex flex-col gap-2">
                  <div className="inline-flex gap-1.5 self-start rounded-full">
                    {event.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-gradient-artist bg-card px-2 py-0.5 font-medium text-xs"
                      >
                        <span className="bg-gradient-artist bg-clip-text text-transparent">
                          {genre}
                        </span>
                      </span>
                    ))}
                  </div>

                  <h2 className="mt-1 font-bold text-white text-xl leading-tight">
                    {event.name}
                  </h2>
                  <p className="font-normal text-sm text-zinc-400">
                    {`${event.location}`} &bull; {`${event.date}`}
                  </p>
                  <p className="font-normal text-sm text-zinc-400">
                    {event.time}
                  </p>

                  <p className="mt-1 font-normal text-sm text-zinc-400">
                    held by{" "}
                    <span className="font-medium text-white">namaAgent</span>
                  </p>
                </div>

                <div className="mt-5 w-full">
                  <Button variant="artist" className="w-full">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
