import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <header className="header">
        <div className="logo">Sign In</div>
        <nav className="nav">
          <Link href="/">Overview</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/pulls">Pull Requests</Link>
        </nav>
      </header>

      <section className="panel">
        <h3>Demo access</h3>
        <p>Use demo@ghc.local / password after seeding.</p>
        <div className="panel-grid">
          <div className="panel">
            <div className="badge">Email</div>
            <div>demo@ghc.local</div>
          </div>
          <div className="panel">
            <div className="badge">Password</div>
            <div>password</div>
          </div>
        </div>
      </section>
    </main>
  );
}
