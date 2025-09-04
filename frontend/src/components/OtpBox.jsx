import { useRef } from "react";

export function OtpBox({ label, length = 6, onChange }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only digits
    if (!/^\d*$/.test(value)) return;

    if (value.length === 1 && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Collect OTP string
    const otp = inputsRef.current.map(input => input.value).join("");
    onChange?.(otp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div>
      {label && (
        <div className="text-sm font-medium text-left py-2">{label}</div>
      )}
      <div className="flex space-x-2">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            className="w-10 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => (inputsRef.current[i] = el)}
          />
        ))}
      </div>
    </div>
  );
}
