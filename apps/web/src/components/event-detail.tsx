// Buat tab my event di dashboard agent

import { ArrowLeftIcon, Clock, Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

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
  <div className="flex items-center gap-1.5">
    <Icon className="h-5 w-5 text-gray-500" />
    <p className="text-base text-gray-500">{text}</p>
  </div>
);

export default function EventDetail() {
  return (
    <Card className="flex w-full flex-col gap-8 bg-neutral-800 p-4">
      <div
        className="contents hover:cursor-pointer"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <ArrowLeftIcon size={28} />
      </div>
      <section className="grid gap-10 px-15 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-video h-auto rounded-xl bg-gray-200 lg:aspect-4/3" />

        <div className="flex flex-col gap-3">
          <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
            NAMAEVENT
          </h1>

          <h2 className="font-medium text-xl">NAMAAGENT</h2>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-gradient-agent bg-card px-2 py-0.5 font-medium text-xs">
              <span className="bg-gradient-agent bg-clip-text text-transparent">
                Pop
              </span>
            </span>
          </div>

          <div className="border-t">
            <div className="grid grid-cols-2 gap-2">
              <InfoItem Icon={MapPin} text="Jakarta" />
              <InfoItem Icon={Clock} text="20:00 WIB - 22:00 WIB" />
              <InfoItem Icon={Instagram} text="@enthufest" />
              <InfoItem Icon={Mail} text="fest@gmail.com" />
            </div>
          </div>

          <div className="space-x-4">
            <Button variant="agentOutline">Edit</Button>
          </div>
        </div>
      </section>
      <section className="flex w-full flex-col gap-6 px-15">
        <h1 className="text-h4">Applicants</h1>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Card className="flex flex-row items-center gap-6 p-4 max-md:flex-col">
            <div className="aspect-square h-full rounded-full bg-gray-100" />
            <div className="flex flex-col items-start">
              <span className="rounded-full border border-gradient-agent bg-card px-2 py-0.5 font-medium text-xs">
                <span className="bg-gradient-agent bg-clip-text text-transparent">
                  Pop
                </span>
              </span>
              <h1 className="text-bodyLarge">NAMABAND</h1>
              <Button className="" variant="agent">
                See Detail
              </Button>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-6 p-4">
            <div className="aspect-square h-full rounded-full bg-gray-100 max-md:w-full" />
            <div className="flex flex-col items-start gap-1">
              <span className="rounded-full border border-gradient-agent bg-card px-2 py-0.5 font-medium text-xs">
                <span className="bg-gradient-agent bg-clip-text text-transparent">
                  Pop
                </span>
              </span>
              <h1 className="text-bodyLarge">NAMABAND</h1>
              <Button className="" variant="agent">
                See Detail
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </Card>
  );
}
