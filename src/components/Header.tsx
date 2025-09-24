import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Logo size="md" showText={true} />
      </div>
    </header>
  );
}
