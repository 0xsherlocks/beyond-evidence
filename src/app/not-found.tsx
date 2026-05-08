"use client";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tighter">404 - Not Found</h1>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">The resource you are looking for does not exist.</p>
      <a href="/" className="px-8 py-3 rounded-full bg-accent text-white font-medium hover:bg-slate-900 transition-colors">
        Return Home
      </a>
    </div>
  );
}
