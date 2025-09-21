import { useEffect, useState } from "react";

type MessageProps = {
    text: string,
    duration: number,
    onClose: () => void,
}

function Message({ text, duration = 1500, onClose }: MessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!visible && onClose) {
      onClose();
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-base-200 text-base-content rounded-lg popup-fade max-w-full max-h-full overflow-auto p-5 border-base-content">
            {text}
        </div>
    </div>
  );
}

export default Message;