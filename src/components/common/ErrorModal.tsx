export const ErrorModal: React.FC<{
  setErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setErrorModalOpen }) => {
  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Error</h2>
        <p>Something went wrong. Please try again.</p>
        <button
          onClick={() => setErrorModalOpen(false)}
          className="px-4 py-2 mt-4 text-white rounded bg-danger"
        >
          Close
        </button>
      </div>
    </div>
  );
};
