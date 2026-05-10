import { useState } from "react";
import Button from "../../ui/components/Button";
import { useCreateReviewMutation } from "../../slices/redux-slices/review";
import StarRating from "../../ui/StarRating";

interface Props {
  open: boolean;
  onClose: () => void;
  booking: any;
  onSuccess?: (bookingId: string) => void;
}

const ReviewModal = ({ open, onClose, booking, onSuccess }: Props) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [createReview, { isLoading }] = useCreateReviewMutation();

  if (!open) return null;

  const handleSubmit = async () => {
    if (!rating) return alert("Please select rating");
    console.log(booking.slot.consultantId);
    console.log(booking.id);
    
    
    try {
      await createReview({
        consultantId: booking.slot.consultantId,
        bookingId: booking.id,
        rating,
        comment
      }).unwrap();
      onSuccess?.(booking.id)
      onClose();
    } catch (err: any) {
        console.log("FULL ERROR:", err);
  console.log("SERVER ERROR:", err?.data);
      alert(err?.data?.message || "Error submitting review");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-lg z-10">
        
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Write Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* consultant info */}
        <div className="mb-4">
          <p className="font-medium">
            {booking.slot.consultant.firstName}{" "}
            {booking.slot.consultant.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {booking.slot.consultant.expertise}
          </p>
        </div>

        {/* rating */}
        <div className="mb-4">
          <p className="text-sm mb-1">Your Rating</p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* comment */}
        <div className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            rows={4}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewModal;