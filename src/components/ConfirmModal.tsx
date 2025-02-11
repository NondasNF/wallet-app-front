interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-bold mb-4">Confirmar Alteração</h3>
        <p>Você tem certeza que deseja alterar o status da sua carteira?</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
