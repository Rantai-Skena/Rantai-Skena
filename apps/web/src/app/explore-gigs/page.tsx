"use client";

import { Calendar, ChevronDown, Clock, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { apiGet } from "@/lib/api-client";

interface ServerEvent {
  id: string;
  agentId: string;
  name: string;
  location: string;
  startsAt: string; // ISO string
  endsAt: string | null;
  genres: string[] | null;
  description: string | null;
  isPublished: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UiEvent {
  id: string;
  name: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  genres: string[];
  imageUrl: string | null;
}

export default function GigsPage() {
  const [events, setEvents] = useState<UiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const data = await apiGet<ServerEvent[]>("/events/public");

        const mapped: UiEvent[] = data.map((e) => ({
          id: e.id,
          name: e.name,
          location: e.location,
          startsAt: new Date(e.startsAt),
          endsAt: e.endsAt ? new Date(e.endsAt) : null,
          genres: e.genres ?? [],
          imageUrl: e.imageUrl,
        }));

        setEvents(mapped);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSelection = (
    item: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const genres = useMemo(() => {
    return Array.from(
      new Set(events.flatMap((e) => e.genres)),
    ).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const cities = useMemo(() => {
    return Array.from(
      new Set(events.map((e) => e.location).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    return events
      .filter((event) => {
        const matchSearch =
          !search ||
          event.name.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search) ||
          event.genres.some((g) => g.toLowerCase().includes(search));

        const matchGenre =
          selectedGenres.size === 0 ||
          event.genres.some((g) => selectedGenres.has(g));

        const matchCity =
          selectedCities.size === 0 || selectedCities.has(event.location);

        return matchSearch && matchGenre && matchCity;
      })
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }, [events, searchQuery, selectedGenres, selectedCities]);

  return (
    <>
      <HeroHeader />
      <div className="flex w-full flex-col gap-10 px-20 py-30 lg:px-40">
        {/* Search + Filters */}
        <div className="flex w-full items-center gap-4 px-20">
          <div className="relative flex w-full items-center">
            <Search className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search gigs / events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-neutral-700 bg-neutral-800 pl-7 text-white placeholder:text-gray-500"
            />
          </div>

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
                  City
                  {selectedCities.size > 0 && ` (${selectedCities.size})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Cities</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {cities.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    No cities yet
                  </div>
                ) : (
                  cities.map((city) => (
                    <DropdownMenuCheckboxItem
                      key={city}
                      checked={selectedCities.has(city)}
                      onCheckedChange={() =>
                        toggleSelection(city, setSelectedCities)
                      }
                    >
                      {city}
                    </DropdownMenuCheckboxItem>
                  ))
                )}

                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  className="w-full text-red-400 hover:text-red-300"
                  onClick={() => setSelectedCities(new Set())}
                >
                  Clear Cities
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuGroup>
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="px-20 text-gray-500">Loading events…</div>
        ) : (
          <div className="grid w-full grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => {
                const dateLabel = event.startsAt.toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                });
                const timeLabel = event.startsAt.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Card
                    key={event.id}
                    className="hover:-translate-y-2 w-full overflow-hidden border border-neutral-700 bg-neutral-800 pb-0 shadow-xl transition-all hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(255,78,134,0.35)]"
                  >
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-gray-600 text-gray-300" />
                    )}

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

                      <div className="flex flex-col gap-1 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{dateLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{timeLabel} WIB</span>
                        </div>
                      </div>

                      <Button
                        variant="artist"
                        className="mt-2 px-10 py-px hover:cursor-pointer"
                        onClick={() => {
                          window.location.href = `/explore-gigs/${event.id}`;
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-gray-500 text-lg">
                No events found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
