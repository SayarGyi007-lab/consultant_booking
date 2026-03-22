type StatusToggleProps = {
    value: "active" | "archived";
    onChange: (value: "active" | "archived") => void;
};

const StatusToggle = ({ value, onChange }: StatusToggleProps) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => onChange("active")}
                className={`px-4 py-2 rounded ${value === "active"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
            >
                Active
            </button>

            <button
                onClick={() => onChange("archived")}
                className={`px-4 py-2 rounded ${value === "archived"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
            >
                Archived
            </button>
        </div>
    );
};

export default StatusToggle;