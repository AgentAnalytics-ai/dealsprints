import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-6">
            <Link href="/about" className="text-mute hover:text-ink transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-mute hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-mute hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
          <p className="text-sm text-mute">
            Powered by <span className="font-medium text-ink">DealSprints</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
