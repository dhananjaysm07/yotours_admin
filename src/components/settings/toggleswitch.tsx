// ToggleSwitch.tsx
export const ToggleSwitch: React.FC<{
    isActive: boolean;
    onToggle: (isActive: boolean) => void;
  }> = ({ isActive, onToggle }) => {
    console.log(isActive)
    return (
      <span
        role="checkbox"
        tabIndex={0}
        onClick={() => onToggle(!isActive)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggle(!isActive);
          }
        }}
        className={`${
          isActive ? 'bg-meta-3' : 'bg-gray-200'
        } relative inline-block w-12 h-6 rounded-full shadow-inner`}
      >
        <span
          aria-hidden="true"
          className={`${
            isActive ? 'translate-x-6' : 'translate-x-0'
          } inline-block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out`}
        />
      </span>
    );
  };