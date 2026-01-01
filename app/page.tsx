import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">Shufflboard</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight mb-6">
            Turn Your Saved Inspiration Into Real Design Fuel
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop losing great designs in bookmarks and screenshots. Organize,
            tag, and search your visual inspiration library.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg font-medium hover:opacity-90 transition"
          >
            Get Started Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Save Anything</h3>
            <p className="text-gray-600">
              URLs, screenshots, tweets, or uploads. Capture inspiration from
              anywhere in seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Tagging</h3>
            <p className="text-gray-600">
              Organize with custom categories and tags. Find exactly what you
              need when you need it.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Search</h3>
            <p className="text-gray-600">
              Full-text search across titles and notes. Filter by any tag
              combination.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
