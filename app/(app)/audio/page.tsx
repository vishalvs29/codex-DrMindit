import { redirect } from "next/navigation";

export default async function AudioPage() {
  // legacy route: redirect to /sessions
  redirect("/sessions");
}
