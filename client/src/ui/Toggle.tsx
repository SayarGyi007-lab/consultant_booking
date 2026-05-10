type StatusToggleProps<T extends string> = {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
  colors?: Partial<Record<T, string>>;
};

const StatusToggle = <T extends string>({
  value,
  options,
  onChange,
  labels,
  colors,
}: StatusToggleProps<T>) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => {
        const isActive = value === option;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded transition ${
              isActive
                ? colors?.[option] || "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {labels?.[option] ?? option}
          </button>
        );
      })}
    </div>
  );
};

export default StatusToggle;