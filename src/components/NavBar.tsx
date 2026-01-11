import { Link } from "react-router";

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Uitlegger
        </Link>
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
      </div>
    </nav>
  );
}
