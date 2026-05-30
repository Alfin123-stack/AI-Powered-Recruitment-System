// SERVER Component — tidak ada directive "use client".
// Render daftar skill sebagai badge. Pure HTML statis.

type JobSkillsProps = {
  skills: string[];
};

export default function JobSkills({ skills }: JobSkillsProps) {
  if (!skills?.length) return null;

  const visible = skills.slice(0, 5);
  const overflow = skills.length - 5;

  return (
    <div className="flex flex-wrap gap-[4px]">
      {visible.map((skill) => (
        <span
          key={skill}
          className="bg-white/[0.035] border border-white/[0.07] text-[#8aaa96] px-[7px] py-[2px] rounded-[4px] text-[0.65rem]"
        >
          {skill}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[#5d7a6a] text-[0.65rem] py-[2px]">
          +{overflow}
        </span>
      )}
    </div>
  );
}
