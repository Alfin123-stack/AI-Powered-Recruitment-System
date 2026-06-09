"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import CalendarInterviewDetailCard from "./CalendarInterviewDetailCard";
import type { Interview } from "@/types/calendar";

interface CalendarSelectedPanelProps {
  selectedDate: string | null;
  selectedIvs: Interview[];
  onClose: () => void;
}

export default function CalendarSelectedPanel({
  selectedDate,
  selectedIvs,
  onClose,
}: CalendarSelectedPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {selectedDate && (
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}>
          <div className="bg-[#070d0a] border border-cyan-500/20 rounded-[16px] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between">
              <div>
                <div className="font-bold text-[0.88rem] text-[#e8f0ec]">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    },
                  )}
                </div>
                <div className="text-[0.68rem] text-[#7a9585] mt-[1px]">
                  {selectedIvs.length > 0
                    ? `${selectedIvs.length} interview`
                    : "Tidak ada interview"}
                </div>
              </div>
              <button
                title="Tutup panel tanggal"
                onClick={onClose}
                className="w-6 h-6 rounded-[5px] flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] bg-transparent border-0 cursor-pointer transition-colors">
                <ChevronLeft size={13} />
              </button>
            </div>
            <div className="p-3">
              {selectedIvs.length === 0 ? (
                <div className="text-center py-5 text-[0.75rem] text-[#7a9585]">
                  Tidak ada jadwal pada tanggal ini.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {selectedIvs.map((iv) => (
                    <CalendarInterviewDetailCard key={iv.id} iv={iv} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
