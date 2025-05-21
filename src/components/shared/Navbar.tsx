import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold">
          MovieCatalog
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/favorites" className="hover:text-primary">
            Избранное
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
