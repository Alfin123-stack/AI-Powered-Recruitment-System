"use client";

import { createContext, useContext } from "react";
import type { DashboardUser } from "@/types/dashboard";
import { Company } from "@/types/company";

type DashboardContextType = {
  user: DashboardUser | null;
  token: string;
  company: Company | null;
  setCompany: (c: Company) => void;
};

export const DashboardContext = createContext<DashboardContextType>({
  user: null,
  token: "",
  company: null,
  setCompany: () => {},
});

export const useDashboard = () => useContext(DashboardContext);
