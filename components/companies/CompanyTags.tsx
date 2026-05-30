// SERVER Component — tidak ada directive "use client".
// Render daftar tag statis. Tidak ada interaktivitas atau hooks.

type CompanyTagsProps = {
  tags: string[];
};

export default function CompanyTags({ tags }: CompanyTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-[4px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-white/[0.035] border border-white/[0.07] text-[#8aaa96] px-[8px] py-[2px] rounded-[4px] text-[0.68rem]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
