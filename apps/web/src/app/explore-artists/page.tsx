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

interface ArtistData {
  id: string;
  name: string;
  genres: string[];
  city?: string | null;
  image?: string | null;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const data = await apiGet<ArtistData[]>("/artists");
        setArtists(data);
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
      const newSet = new Set(prev);
      if (newSet.has(item)) newSet.delete(item);
      else newSet.add(item);
      return newSet;
    });
  };

  const filteredArtists = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    return artists.filter((artist) => {
      const matchSearch =
        !search ||
        artist.name.toLowerCase().includes(search) ||
        artist.genres.some((g) => g.toLowerCase().includes(search));

      const matchGenre =
        selectedGenres.size === 0 ||
        artist.genres.some((g) => selectedGenres.has(g));

      return matchSearch && matchGenre;
    });
  }, [artists, searchQuery, selectedGenres]);

  return (
    <>
      <HeroHeader />
      <div className="flex w-full flex-col gap-10 px-20 py-30 lg:px-40">
        {/* Search + Filters */}
        <div className="flex w-full items-center gap-4 px-20">
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

                  {/* Clear Genres Button */}
                  <Button
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300"
                    onClick={() => setSelectedGenres(new Set())}
                  >
                    Clear Genres
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuGroup>
          </div>
        </div>

        {/* Artist Grid */}
        <div className="grid w-full grid-cols-3 gap-6">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <Card
                key={artist.id}
                className="hover:-translate-y-2 w-full overflow-hidden border border-neutral-700 bg-neutral-800 pb-0 shadow-xl transition-all hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(255,78,134,0.35)]"
              >
                {/* <div className="flex aspect-video w-full items-center justify-center bg-gray-600 text-gray-300" />
                 */}
                {artist.image ? (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="flex aspect-video w-full items-center justify-center"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-gray-600 text-gray-300">
                    No Image
                  </div>
                )}

                <div className="flex flex-col gap-3 p-4">
                  <h3 className="font-bold text-white text-xl leading-tight">
                    {artist.name}
                  </h3>

                  <div className="mb-2 flex flex-wrap gap-2">
                    {artist.genres.map((genre) => (
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

                  <Button
                    variant="agent"
                    className="px-10 py-1"
                    onClick={() =>
                      (window.location.href = `/explore-artists/${artist.id}`)
                    }
                  >
                    Detail
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 text-lg">
              No artists found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
