import { PenBox } from "lucide-react";
import Link from "next/link";

export default function MyMusic() {
  return (
    <div className="flex h-fit w-full flex-col gap-15 rounded-2xl bg-neutral-900 p-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h4 className="text-h5">My Music</h4>
          <div className="contents hover:cursor-pointer">
            <img src="add.svg" alt="add" className="h-10 w-auto" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex w-max flex-row space-x-4">
            <div className="flex shrink-0 flex-col items-start gap-1">
              <div className="relative h-40 w-40 overflow-hidden rounded-xl bg-gray-200">
                <img
                  src="agent.png"
                  alt="cover"
                  className="relative h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-autumn-500">
                  <PenBox size={16} />
                </div>
              </div>
              <h5 className="text-bodyLarge">Nama Lagu</h5>
              <div className="flex gap-2">
                <Link href="/" className="contents">
                  <img src="spotify.svg" alt="spotify" className="h-4 w-auto" />
                </Link>
                <Link href="/" className="contents">
                  <img src="youtube.svg" alt="youtube" className="h-4 w-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center gap-4">
          <h4 className="text-h5">My Galery</h4>
          <div className="contents hover:cursor-pointer">
            <img src="add.svg" alt="add" className="h-10 w-auto" />
          </div>
        </div>
        <div className="scrollbar-hide h-52 overflow-x-scroll">
          <div className="flex h-full w-max flex-row space-x-4">
            <div className="aspect-video h-full min-w-[300px] shrink-0 bg-gray-200" />
            <div className="aspect-video h-full min-w-[300px] shrink-0 bg-gray-200" />
            <div className="aspect-video h-full min-w-[300px] shrink-0 bg-gray-200" />
            <div className="aspect-video h-full min-w-[300px] shrink-0 bg-gray-200" />
            <div className="aspect-video h-full min-w-[300px] shrink-0 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
