import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

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

export default function MyEvent() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-8 rounded-xl bg-neutral-900 p-6">
      <div className="relative h-fit max-w-md">
        <Search className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search"
          className="border-neutral-700 bg-neutral-800 pl-7 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {dummyEvents.map((event) => (
          <Card
            key={event.id}
            className="hover:-translate-y-2 w-full overflow-hidden border border-neutral-700 bg-neutral-800 pb-0 shadow-xl transition-all hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(255,78,134,0.35)]"
          >
            <div className="flex aspect-video w-full items-center justify-center bg-neutral-500 text-gray-300" />

            <div className="flex flex-col gap-3 p-4">
              <h3 className="font-bold text-white text-xl leading-tight">
                {event.name}
              </h3>

              <div className="mb-2 flex flex-wrap gap-2">
                {event.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-gradient-agent bg-card px-2 py-0.5 font-medium text-xs"
                  >
                    <span className="bg-gradient-agent bg-clip-text text-transparent">
                      {genre}
                    </span>
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p>{event.location}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <p>{event.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <p>{event.time}</p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <Button variant="agent" className="px-10 py-px">
                  View
                </Button>
                <Button variant="agentOutline" className="px-10 py-px">
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
