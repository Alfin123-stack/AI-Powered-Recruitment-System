// SERVER Component — tidak ada directive "use client".
// website dihapus karena kolom tidak ada di DB.

import { MapPin } from "lucide-react";

type CompanyLocationProps = {
  location?: string;
};

export default function CompanyLocation({ location }: CompanyLocationProps) {
  if (!location) return null;

  return (
    <div className="flex items-center gap-[4px] text-[#5d7a6a] text-[0.72rem]">
      <MapPin size={11} /> {location}
    </div>
  );
}