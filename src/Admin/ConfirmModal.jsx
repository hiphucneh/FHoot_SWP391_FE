// src/Admin/ConfirmModal.jsx
function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-6">{message}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onConfirm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
            <button 
              onClick={onCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ConfirmModal;
  