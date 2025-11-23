"use client";

import { Calendar, ChevronDown, Clock, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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

type GigRow = {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  venue: string | null;
  coverUrl: string | null;
  startDate: string;
  endDate: string;
  status: string;
  artistId: string;
  createdAt: string;
};

const GENRES = [
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
] as const;

const CITIES = [
  "Jakarta",
  "Bandung",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bogor",
  "Surabaya",
  "Semarang",
] as const;

export default function GigsPage() {
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gigs, setGigs] = useState<GigRow[]>([]);
  const [loading, setLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    void fetchGigs();
  }, []);

  const fetchGigs = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await apiGet<GigRow[]>("/explore-gigs");
      setGigs(data);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch gigs:", error);
      }
      toast.error("Gagal mengambil data gigs explore");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (
    item: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ): void => {
    setter((previousSet) => {
      const newSet = new Set(previousSet);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  const filteredGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        // Search query filter
        const matchesSearch =
          searchQuery === "" ||
          gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gig.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // City filter
        const matchesCity =
          selectedCities.size === 0 ||
          (gig.city && selectedCities.has(gig.city));

        return matchesSearch && matchesCity;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
  }, [gigs, searchQuery, selectedCities]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <HeroHeader />
        <div className="flex w-full justify-center py-20">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            <span className="text-gray-400">Loading gigs...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroHeader />
      <div className="flex w-full flex-col gap-10 px-20 py-30 lg:px-40">
        {/* Search + Filters */}
        <div className="flex w-full items-center gap-4">
          <div className="relative flex w-full items-center">
            <Search className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search gigs..."
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

                  {GENRES.map((genre) => (
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
                    Location
                    {selectedCities.size > 0 && ` (${selectedCities.size})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Locations</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {CITIES.map((city) => (
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

        {/* Gigs Grid */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <Card
                key={gig.id}
                className="hover:-translate-y-2 w-full overflow-hidden border border-neutral-700 bg-neutral-800 pb-0 shadow-xl transition-all hover:border-sky-500 hover:shadow-[0_0_25px_rgba(31,154,255,0.35)]"
              >
                <div className="flex aspect-video w-full items-center justify-center bg-gray-600 text-gray-300">
                  {gig.coverUrl ? (
                    <img
                      src={gig.coverUrl}
                      alt={`${gig.title} cover`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 p-4">
                  <h3 className="font-bold text-white text-xl leading-tight">
                    {gig.title}
                  </h3>

                  {gig.description && (
                    <p className="line-clamp-2 text-gray-400 text-sm">
                      {gig.description}
                    </p>
                  )}

                  <div className="space-y-2 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <p>{gig.venue || gig.city || "TBA"}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <p>{formatDate(gig.startDate)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <p>{formatTime(gig.startDate)}</p>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <Button variant="artist" className="px-10 py-px">
                      View
                    </Button>
                    <Button variant="artistOutline" className="px-10 py-px">
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No gigs found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
