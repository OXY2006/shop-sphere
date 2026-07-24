import Link from "next/link";

import Container from "./container";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import LogoutButton from "./logout-button";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Shop Sphere
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost">
                  Profile
                </Button>
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button variant="outline">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </Container>
    </header>
  );
}