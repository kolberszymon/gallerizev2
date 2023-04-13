import { FC, ReactNode, useState, useEffect } from "react";

interface DoodleButtonProps {
  underLabel?: string;
  arrowTrigger?: Array<"ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight">;
  onClick?: () => void;
  children?: ReactNode;
}

const DoodleButton: FC<DoodleButtonProps> = ({
  underLabel,
  arrowTrigger,
  onClick,
  children,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        arrowTrigger?.includes(
          e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
        )
      ) {
        setIsActive(true);
        onClick?.();
      } else {
        setIsActive(false);
      }
    };

    const handleKeyUp = () => {
      setIsActive(false);
    };

    if (arrowTrigger) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      if (arrowTrigger) {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [onClick, arrowTrigger]);

  return (
    <button
      className={`${
        isActive ? "doodle-button-pressed" : ""
      } p-4 bg-white doodle-shadow rounded-md hover:bg-gray-200 relative doodle-button flex flex-col items-center justify-center border border-black`}
      onClick={onClick}
    >
      {children}
      {underLabel && (
        <span className="absolute bottom-0 text-xs text-gray-500">
          {underLabel}
        </span>
      )}
    </button>
  );
};

export default DoodleButton;
