export function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center border border-blue-600 bg-blue-600 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-blue-700 focus:outline-none focus:shadow-outline"
    >
      {label}
    </button>
  );
}
