import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-yellow-400 p-4 shadow text-center font-bold text-lg">
        <Link href="/">Lettre OYONO IA</Link>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
