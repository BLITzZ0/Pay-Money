import { Link } from "react-router-dom";

export function BottomWarning({ label, buttontext, to }) {
  return (
    <div className="py-2 text-sm flex justify-center gap-1">
      <div>{label}</div>
      <Link to={to} className="text-blue-500 hover:underline">
        {buttontext}
      </Link>
    </div>
  );
}
