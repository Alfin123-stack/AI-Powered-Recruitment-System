import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/getServerSession";
import { getUserRole } from "@/lib/auth/getUserRole";

import { CalendarClient } from "./CalendarClient";
import type { Interview } from "@/types/calendar";
import { fetchWithToken } from "@/lib/fetchers/hr/fetchWithToken";

export async function CalendarServer() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = await getUserRole(session.user.id);

  if (role !== "hr") {
    redirect("/dashboard/candidate");
  }

  const interviews =
    (await fetchWithToken<Interview[]>(
      "/api/interviews",
      session.access_token,
    )) ?? [];

  return <CalendarClient interviews={interviews} />;
}
