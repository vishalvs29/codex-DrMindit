import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-cyanGlow/20 text-cyanGlow">
            <BrainCircuit className="h-5 w-5" />
          </span>
          DrMindit
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/schools" className="hover:text-white">Schools</Link>
          <Link href="/corporate" className="hover:text-white">Corporate</Link>
          <Link href="/military" className="hover:text-white">Military</Link>
          <Link href="#pricing" className="hover:text-white">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in" className="hidden text-sm text-slate-300 hover:text-white sm:block">
              Log in
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Start free</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="sm" variant="secondary">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
