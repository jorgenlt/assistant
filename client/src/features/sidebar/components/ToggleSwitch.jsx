const ToggleSwitch = ({
  id = "toggle",
  label,
  checked,
  onChange,
  disabled,
}) => {
  const handleChange = (e) => onChange?.(e.target.checked);

  return (
    <div className="flex justify-between w-full justify-items">
      {label && <span className="text-lg" >{label}</span>}
      <label
        htmlFor={id}
        className={`relative inline-flex items-center cursor-pointer select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label={label}
      >
        <span className="sr-only">{label}</span>

        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={!!checked}
          onChange={handleChange}
          disabled={disabled}
        />

        {/* Track */}
        <span
          className="w-14 h-8 bg-gray-300 rounded-full inline-block transition-colors duration-200
                   peer-checked:bg-[var(--hover)]"
          aria-hidden="true"
        />

        {/* Knob - move a bit less to leave a small gap on the right */}
        <span
          className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md
                   transition-transform duration-200
                   peer-checked:translate-x-6"
          aria-hidden="true"
        />
      </label>
    </div>
  );
};

export default ToggleSwitch;
