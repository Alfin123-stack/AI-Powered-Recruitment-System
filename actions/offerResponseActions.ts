"use server";

import { API } from "@/lib/api";

import type { ActionResult } from "./offerActions";

// Called from OfferResponseClient's Accept/Decline buttons — i.e. only when
// the candidate has explicitly clicked something inside the app, not when
// the confirmation page is merely loaded/GET'd. This is what keeps the
// mutation safe from email security scanners / link-preview bots that
// auto-follow links in emails (they only ever trigger a GET page load,
// never a click on this button).
//
// FIX: previously also auto-sent the "Welcome aboard" onboarding
// confirmation email right here whenever offerStatus === "accepted". Itu
// dihapus atas permintaan — confirmation email sekarang TIDAK dikirim
// otomatis saat Accept, tapi digabung dan dikirim serempak dengan email
// onboarding biasa saat HR klik "Send Onboarding Email" (lihat
// sendOnboardingEmailAction di onboardingActions.ts). Fungsi ini jadi
// murni cuma update offer_status, tidak lagi mengirim email apa pun.
export async function respondToOfferAction(
  applicationId: string,
  token: string,
  offerStatus: "accepted" | "declined",
): Promise<ActionResult> {
  if (!applicationId || !token) {
    return { success: false, error: "This link is missing required information." };
  }

  try {
    const res = await fetch(`${API}/api/applications/${applicationId}/offer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // No Bearer token here on purpose — the candidate clicking this link
      // from their email isn't necessarily logged in. The signed `token`
      // (HMAC, scoped to this applicationId + expiry) is what the backend's
      // offerAuthMiddleware verifies instead.
      body: JSON.stringify({ offer_status: offerStatus, token }),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}) as { error?: string });
      return {
        success: false,
        error: err.error || "Something went wrong. Please try again.",
      };
    }

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[respondToOfferAction] failed:", err);
    return {
      success: false,
      error: "We couldn't reach the server. Please try again in a moment.",
    };
  }
}