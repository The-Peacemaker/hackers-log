export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-glass mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <span className="nf nf-dev-terminal text-amber-600 text-sm" />
          <span>{currentYear} Benedict. Built with intention.</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/benedii"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors link-underline"
          >
            <span className="nf nf-fa-github" />
            GitHub
          </a>
          <a
            href="/feed"
            className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors link-underline"
          >
            <span className="nf nf-fa-rss" />
            RSS
          </a>
          <a
            href="mailto:benedict@example.com"
            className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors link-underline"
          >
            <span className="nf nf-md-email_outline" />
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
