import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0 min-h-screen">
        <header className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800 }}>Inbox Placement</div>
            <nav style={{ display: "flex", gap: "1rem" }}>
              <Link href="/" aria-label="Home">Home</Link>
              <Link href="/" aria-label="Docs">Docs</Link>
            </nav>
          </div>
        </header>
        <main className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          {children}
        </main>
        <footer className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              © {new Date().getFullYear()} Inbox Placement
            </span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
