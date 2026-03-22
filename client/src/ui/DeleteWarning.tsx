import Button from "./Button";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  confirmVariant?: "danger" | "success" | "uncommon" | "primary"; // optional
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteWarning = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading,
  confirmVariant = "danger", // default is danger
  onConfirm,
  onCancel,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">

        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="uncommon" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>

      </div>
    </div>
  );
}

export default DeleteWarning