import Link from "next/link";
import { Card } from "./ui/card";

const members = [
  {
    name: "Gibran Tegar Ramadhan Putra Lynardi",
    role: "Lead - Product Manager",
    avatar: "anggota-tim/aldo.JPG",

    link: "https://www.linkedin.com/in/gibranlynardi/",
  },
  {
    name: "Muhammad Rifqi Ilham",
    role: "Business Development",
    avatar: "anggota-tim/aldo.JPG",

    link: "https://www.linkedin.com/in/rifqi-ilham/",
  },
  {
    name: "Heraldo Arman",
    role: "Software Engineer",
    avatar: "anggota-tim/aldo.JPG",

    link: "https://www.linkedin.com/in/heraldo-arman",
  },
  {
    name: "Ananda Gautama Sekar Khosmana",
    role: "Software Engineer",
    avatar: "anggota-tim/aldo.JPG",

    link: "https://www.linkedin.com/in/anandagautama/",
  },
  {
    name: "Inayah Saffanah Asri",
    role: "UI/UX Designer",
    avatar: "anggota-tim/aldo.JPG",
    link: "https://www.linkedin.com/in/inayah-saffanah-asri-234970302/",
  },
] as const;

export const Team = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.4em]">
            Our Team
          </p>
          <h2 className="mt-4 font-semibold text-h3 text-white md:text-h2">
            Meet the visionaries behind{" "}
            <span className="text-autumn-500">RantaiSkena</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body text-muted-foreground">
            Passionate individuals dedicated to connecting Indonesian culture
            with the world through innovative technology and authentic
            experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Card
              key={member.name}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-background/40 p-0 shadow-lg transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="relative overflow-hidden">
                <img
                  className="h-80 w-full object-cover object-top grayscale transition-all duration-500 group-hover:h-72 group-hover:scale-105 group-hover:grayscale-0"
                  src={member.avatar}
                  alt={`${member.name} - ${member.role}`}
                  width="400"
                  height="600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-white transition-all duration-500 group-hover:tracking-wider">
                    {member.name}
                  </h3>
                  <span className="text-muted-foreground text-xs">
                    _0{index + 1}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-block translate-y-6 text-autumn-400 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {member.role}
                  </span>
                  <Link
                    href={member.link}
                    className="inline-block translate-y-8 text-primary text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Connect
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
