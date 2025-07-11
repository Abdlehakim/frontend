// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[16px]">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-600">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}
