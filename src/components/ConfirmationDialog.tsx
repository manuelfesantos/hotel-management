import { Button } from "./Button.tsx";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000C3] z-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full m-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} className="px-4 py-2 text-gray-600">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Apagar
          </Button>
        </div>
      </div>
    </div>
  );
};
