import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-16">
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white">404</h1>
        <div className="h-px w-24 bg-gray-600 mx-auto mb-6"></div>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">This page could not be found.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#8500FF] hover:bg-[#9500FF] text-white font-semibold rounded-md transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

