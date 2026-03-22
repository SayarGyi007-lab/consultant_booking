type AlertProps = {
    type: "success" | "error";
    message: string;
    onClose?: () => void;
};

const Alert = ({ type, message, onClose }: AlertProps) => {
    if (!message) return null;

    const baseStyle = "px-4 py-2 rounded-lg text-sm flex justify-between items-center";

    const styles =
        type === "success"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600";

    return (
        <div className={`${baseStyle} ${styles}`}>
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} className="ml-2">
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;