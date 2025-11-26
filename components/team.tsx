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
      name: "Sarah Chen",
      role: "CEO & Founder",
      avatar: "",
    },
    {
      id: "member-2",
      name: "Marcus Rodriguez",
      role: "CTO",
      avatar: "",
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
      <div className="w-full max-w-7xl mx-auto mt-16 flex gap-x-30 gap-y-16 items-center justify-center">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className="mb-4 size-20 border rounded-full md:mb-5 lg:size-40">
              <Image src={member.avatar} alt="avatar" width={20} height={20} />
              <p className="text-muted-foreground text-center">{member.name}</p>
            </div>
            <p className="text-center font-medium">{member.name}</p>
            <p className="text-muted-foreground text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { TeamSection };
