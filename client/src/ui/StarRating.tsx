import { useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ value, onChange }: Props) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition"
        >
          <span
            className={
              star <= (hover || value)
                ? "text-yellow-400"
                : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;