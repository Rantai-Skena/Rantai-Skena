"use client";
import { Calendar, ChevronDown, Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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
    location: "Jakarta",
    date: "25 Nov 2025",
    time: "19:00 WIB",
    genres: ["Rock", "Metalcore"],
  },
  {
    id: 2,
    name: "Indie Sunset",
    location: "Bandung",
    date: "10 Des 2025",
    time: "16:00 WIB",
    genres: ["Indie", "Pop"],
  },
  {
    id: 3,
    name: "Jazz & Blues Night",
    location: "Depok",
    date: "05 Jan 2026",
    time: "20:30 WIB",
    genres: ["Jazz", "R&B"],
  },
  {
    id: 4,
    name: "EDM Festival X",
    location: "Bogor",
    date: "14 Feb 2026",
    time: "22:00 WIB",
    genres: ["EDM", "HipHop"],
  },
  {
    id: 5,
    name: "Punk Revival",
    location: "Jakarta",
    date: "01 Mar 2026",
    time: "18:00 WIB",
    genres: ["Punk", "Hardcore"],
  },
  {
    id: 6,
    name: "Emo & Hardcore Fest",
    location: "Tangerang",
    date: "15 Mar 2026",
    time: "17:30 WIB",
    genres: ["Emo", "Hardcore"],
  },
];

export default function GigsPage() {
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const genres = [
    "Pop",
    "Indie",
    "Hardcore",
    "Emo",
    "Rock",
    "Jazz",
    "R&B",
    "HipHop",
    "Punk",
    "Metalcore",
    "EDM",
  ];

  const cities = [
    "Jakarta",
    "Bandung",
    "Depok",
    "Tangerang",
    "Bekasi",
    "Bogor",
    "Surabaya",
    "Semarang",
  ];

  const toggleSelection = (
    item: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    setter((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) newSet.delete(item);
      else newSet.add(item);
      return newSet;
    });
  };

  // 🔍 FILTERING
  const filteredEvents = dummyEvents.filter((event) => {
    const search = searchQuery.toLowerCase();

    const matchSearch =
      event.name.toLowerCase().includes(search) ||
      event.location.toLowerCase().includes(search) ||
      event.genres.some((g) => g.toLowerCase().includes(search));

    const matchGenre =
      selectedGenres.size === 0 ||
      event.genres.some((g) => selectedGenres.has(g));

    const matchCity =
      selectedCities.size === 0 || selectedCities.has(event.location);

    return matchSearch && matchGenre && matchCity;
  });

  return (
    <>
      <HeroHeader />
      <div className="flex w-full flex-col gap-10 px-20 py-30 lg:px-40">
        {/* Search + Filters */}
        <div className="flex w-full items-center gap-4">
          <div className="relative flex w-full items-center">
            <Search className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-neutral-700 bg-neutral-800 pl-7 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenuGroup className="flex gap-2">
              {/* Genre Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    Genre
                    {selectedGenres.size > 0 && ` (${selectedGenres.size})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {genres.map((genre) => (
                    <DropdownMenuCheckboxItem
                      key={genre}
                      checked={selectedGenres.has(genre)}
                      onCheckedChange={() =>
                        toggleSelection(genre, setSelectedGenres)
                      }
                    >
                      {genre}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* 🔥 CLEAR GENRES BUTTON */}
                  <Button
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300"
                    onClick={() => setSelectedGenres(new Set())}
                  >
                    Clear Genres
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* City Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    Location
                    {selectedCities.size > 0 && ` (${selectedCities.size})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Locations</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {cities.map((city) => (
                    <DropdownMenuCheckboxItem
                      key={city}
                      checked={selectedCities.has(city)}
                      onCheckedChange={() =>
                        toggleSelection(city, setSelectedCities)
                      }
                    >
                      {city}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* 🔥 CLEAR CITIES BUTTON */}
                  <Button
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300"
                    onClick={() => setSelectedCities(new Set())}
                  >
                    Clear Locations
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuGroup>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid w-full grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:-translate-y-2 w-full overflow-hidden border border-neutral-700 bg-neutral-800 pb-0 shadow-xl transition-all hover:border-sky-500 hover:shadow-[0_0_25px_rgba(31,154,255,0.35)]"
              >
                <div className="flex aspect-video w-full items-center justify-center bg-gray-600 text-gray-300" />

                <div className="flex flex-col gap-3 p-4">
                  <h3 className="font-bold text-white text-xl leading-tight">
                    {event.name}
                  </h3>

                  <div className="mb-2 flex flex-wrap gap-2">
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

                  <div className="space-y-2 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <p>{event.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <p>{event.date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <p>{event.time}</p>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <Button variant="artist" className="px-10 py-px">
                      View
                    </Button>
                    <Button variant="artistOutline" className="px-10 py-px">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 text-lg">
              No events found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
