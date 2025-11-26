import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TeamProps {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const TeamSection = ({
  heading = "Team",
  description = "Our diverse team of experts brings together decades of experience in design, engineering, and product development.",
  members = [
    {
      id: "member-1",
      name: "Pandu Nugaha Saputra",
      role: "Frontend Developer",
      avatar: "/foto-pandu.jpeg",
    },
    {
      id: "member-2",
      name: "Bima Adnadnita",
      role: "Frontend Developer",
      avatar: "/foto-bima.jpeg",
    },
  ],
}: TeamProps) => {
  return (
    <section className="py-20 px-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
          {heading}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl lg:text-xl">
          {description}
        </p>
      </div>
      <div className="w-full max-w-7xl mx-auto mt-16 flex flex-wrap gap-x-10 gap-y-16 items-start justify-center">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center w-[150px] lg:w-[200px]"
          >
            <div className="relative mb-4 size-20 lg:size-40 border rounded-full overflow-hidden bg-muted md:mb-5">
              <Image
                src={member.avatar} // Kasih fallback kalau avatar kosong
                alt={member.name}
                fill // Mengisi penuh wadah induknya (si div relative di atas)
                className="object-cover" // Memastikan gambar tidak gepeng, tercrop rapi
                sizes="(max-width: 1024px) 80px, 160px" // Optimalisasi loading gambar Next.js
              />
            </div>

            {/* --- TEKS (Di luar lingkaran) --- */}
            <p className="text-center font-medium text-lg">{member.name}</p>
            <p className="text-muted-foreground text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { TeamSection };
