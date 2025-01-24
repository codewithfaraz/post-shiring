import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/home"
      className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-600"
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
          className="fill-current"
          fillOpacity="0.2"
        />
        <path
          d="M23 12h-3.278l.707-3.535A1 1 0 0019.45 7.2l-7 4.667a1 1 0 00-.45.833V19h3.278l-.707 3.535a1 1 0 00.979 1.265 1 1 0 00.557-.17l7-4.667a1 1 0 00.45-.833V13a1 1 0 00-1-1z"
          className="fill-current"
        />
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 26C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z"
          className="fill-current"
        />
      </svg>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        PostShare
      </span>
    </Link>
  );
}
