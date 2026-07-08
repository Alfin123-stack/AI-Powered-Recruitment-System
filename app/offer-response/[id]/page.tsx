import OfferResponseClient from "./OfferResponseClient";

// FIX: replaces the old app/api/offer/[id]/accept|decline GET route
// handlers, which used to mutate offer_status as a side effect of a plain
// GET request. That's unsafe — email security scanners (Outlook Safe
// Links, corporate antivirus, link-preview bots) auto-follow every link in
// an email to check it, which would silently accept/decline the offer
// before the candidate ever saw it.
//
// This page only *renders* a confirmation screen (safe to GET/prefetch as
// many times as anyone likes). The actual mutation only happens when the
// candidate clicks a button, via respondToOfferAction (see
// OfferResponseClient.tsx) — same principle as a "confirm unsubscribe"
// page.
export default async function OfferResponsePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    token?: string;
    intent?: string;
    job?: string;
    company?: string;
    salary?: string;
    start?: string;
  }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  return (
    <OfferResponseClient
      applicationId={id}
      token={sp.token ?? ""}
      intent={sp.intent === "decline" ? "decline" : "accept"}
      jobTitle={sp.job ?? ""}
      companyName={sp.company ?? ""}
      salary={sp.salary ?? ""}
      startDate={sp.start ?? ""}
    />
  );
}
