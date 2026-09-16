import  { useState } from "react";
import useAllMyBookings from "../../../../features/hooks/BookingHooks/useAllMyBookings";
import { useReview } from "../../../../features/hooks/reviewHooks/useReview";

import styled, { css } from "styled-components";

const AlertBox = styled.div`
  padding: 1.4rem 1.8rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  font-size: 1.4rem;
  line-height: 1.5;

  ${({ $type }) => {
    switch ($type) {
      case "success":
        return css`
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;

      case "error":
        return css`
          background: rgba(239, 68, 68, 0.12);
          color: #ffffff;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;

      default:
        return css`
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.3);
        `;
    }
  }}
`;

const Label = styled.label`
  display: block;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
`;

const ComparisonCard = styled.div`
  width: 100%;
  padding: 2rem;
  border-radius: 1.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ $black }) => ($black ? "#111" : "#fff")};
  font-size: 2rem;
  font-weight: 700;
`;

const CardSubtitle = styled.p`
  margin: 0;
  color: ${({ $black }) =>
    $black ? "rgba(17,17,17,.7)" : "rgba(255,255,255,.75)"};
  line-height: 1.7;
  font-size: 1.45rem;
`;

const RatingStarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }
`;

const StarSpan = styled.span`
  display: inline-block;
  font-size: ${({ $size }) => $size || "1rem"};
  color: ${({ $active }) => ($active ? "#FFD43B" : "#5b5b5b")};
  transition: 0.2s;
  user-select: none;

  &:hover {
    transform: scale(1.15);
  }
`;

const StatusBadge = styled.span`
  margin-left: 1rem;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 600;

  ${({ $type }) => {
    switch ($type) {
      case "success":
        return css`
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
        `;

      case "warning":
        return css`
          background: rgba(251, 191, 36, 0.15);
          color: #facc15;
        `;

      default:
        return css`
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        `;
    }
  }}
`;
import {
  ConsultationCard,
  ConsultationContent,
  ConsultationHeading,
  ConsultationDescription,
  Form,
  InputGroup,
  Input,
  Select,
  TextArea,
  SubmitButton
} from "../../../Trust/Trust.styles";

import { Link } from 'react-router-dom';
export default function Review({ onReviewSuccess }) {
  const { bookings, isLoading, isError, error } = useAllMyBookings();
  const {addReview , isLoading : addReviewLoading } = useReview();

  // Filter completed & fullPaid tours eligible for review
  const eligibleBookings = bookings.filter((b) => {
    const isCompleted =
      b.bookingStatus === "complete" || b.bookingStatus === "completed";
    const isFullPaid =
      b.paymentStatus === "fullPaid" ||
      b.payment?.status === "fullPaid" ||
      b.paymentStatus === "paid" ||
      (b.totalAmount && b.amountPaid && b.amountPaid >= b.totalAmount);
    return isCompleted && isFullPaid;
  });

  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");

  const [subRatings, setSubRatings] = useState({
    guide: 5,
    hotel: 5,
    transport: 5,
    valueForMoney: 5,
    itinerary: 5,
  });

  const [formAlert, setFormAlert] = useState(null);

  const handleBookingChange = (e) => {
    setSelectedBookingId(e.target.value);
    setFormAlert(null);
  };

  const handleSubRatingChange = (category, value) => {
    setSubRatings((prev) => ({
      ...prev,
      [category]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormAlert(null);

    if (!selectedBookingId) {
      setFormAlert({
        type: "error",
        message: "Please select an eligible completed tour to review.",
      });
      return;
    }

    if (!reviewText.trim()) {
      setFormAlert({
        type: "error",
        message: "Please enter your review feedback.",
      });
      return;
    }

    const bookingObj = eligibleBookings.find(
      (b) => b._id === selectedBookingId,
    );

    const tourId = bookingObj?.tour?._id || bookingObj?.tour;

    const payload = {
      bookingId: selectedBookingId,
      tourId,
      rating,
      subRatings,
      title,
      review: reviewText,
    };

    try {
      await addReview(payload);

      setFormAlert({
        type: "success",
        message:
          "Thank you! Your verified tour review has been submitted successfully.",
      });

      setSelectedBookingId("");
      setRating(5);
      setHoverRating(0);
      setTitle("");
      setReviewText("");

      setSubRatings({
        guide: 5,
        hotel: 5,
        transport: 5,
        valueForMoney: 5,
        itinerary: 5,
      });

      onReviewSuccess?.();
    } catch (err) {
      setFormAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to submit review. Please try again.",
      });
    }
  };

  return (
    <ConsultationCard style={{width: "100%"}}>
      <p>
        <Link to="/user/all-review" style={{ color: "#ffffff" }}>
          View All Reviews
        </Link>
      </p>
      <ConsultationContent>
        <ConsultationHeading>
          Leave Your Verified Tour Experience
        </ConsultationHeading>
        <ConsultationDescription>
          Reviews are strictly enabled for verified bookings with{" "}
          <strong>Completed Trip</strong> status and <strong>Full Paid</strong>{" "}
          payment verification.
        </ConsultationDescription>

        {isLoading && (
          <AlertBox $type="info">
            Loading your verified tour bookings list...
          </AlertBox>
        )}

        {isError && (
          <AlertBox $type="error">
            Unable to fetch bookings:{" "}
            {error?.message || "Server connection issue."}
          </AlertBox>
        )}

        {formAlert && (
          <AlertBox $type={formAlert.type}>{formAlert.message}</AlertBox>
        )}

        {!isLoading && eligibleBookings.length === 0 ? (
          <ComparisonCard $primary={false}>
            <CardHeader>
              <CardTitle $black={false}>
                No Completed & Full Paid Tours Found
              </CardTitle>
            </CardHeader>
            <CardSubtitle $black={false}>
              Review submission requires a booking with{" "}
              <strong>bookingStatus: 'complete'</strong> and{" "}
              <strong>paymentStatus: 'fullPaid'</strong>. You currently have no
              completed expeditions matching these criteria.
            </CardSubtitle>
          </ComparisonCard>
        ) : (
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <div>
                <Label htmlFor="bookingSelect">
                  Select Completed & Full Paid Tour *
                </Label>
                <Select
                  id="bookingSelect"
                  value={selectedBookingId}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">-- Choose Eligible Tour Booking --</option>
                  {eligibleBookings.map((b) => {
                    const tourName =
                      b.tour?.name ||
                      b.packageName ||
                      `Booking #${b.bookingNumber}`;
                    return (
                      <option key={b._id} value={b._id}>
                        {tourName} (Booking: {b.bookingNumber}) - Verified
                        Complete
                      </option>
                    );
                  })}
                </Select>
              </div>

              <div>
                <Label>Overall Tour Rating (1 to 5 Stars) *</Label>
                <RatingStarGroup>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} star`}
                    >
                      <StarSpan
                        $active={star <= (hoverRating || rating)}
                        $size="2.6rem"
                      >
                        ★
                      </StarSpan>
                    </button>
                  ))}
                  <StatusBadge $type="success">{rating} / 5 Stars</StatusBadge>
                </RatingStarGroup>
              </div>
            </InputGroup>

            <InputGroup>
              <div>
                <Input
                  id="reviewTitle"
                  type="text"
                  placeholder="e.g. Unforgettable Alpine Treks & Professional Guide"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                />
              </div>

              <div>
                <InputGroup>
                  <Select
                    value={subRatings.guide}
                    onChange={(e) =>
                      handleSubRatingChange("guide", e.target.value)
                    }
                  >
                    <option value={5}>Guide: 5 Stars</option>
                    <option value={4}>Guide: 4 Stars</option>
                    <option value={3}>Guide: 3 Stars</option>
                    <option value={2}>Guide: 2 Stars</option>
                    <option value={1}>Guide: 1 Star</option>
                  </Select>

                  <Select
                    value={subRatings.hotel}
                    onChange={(e) =>
                      handleSubRatingChange("hotel", e.target.value)
                    }
                  >
                    <option value={5}>Hotel: 5 Stars</option>
                    <option value={4}>Hotel: 4 Stars</option>
                    <option value={3}>Hotel: 3 Stars</option>
                    <option value={2}>Hotel: 2 Stars</option>
                    <option value={1}>Hotel: 1 Star</option>
                  </Select>
                </InputGroup>
              </div>
            </InputGroup>

            <div>
              <TextArea
                id="reviewBody"
                placeholder="Share details of your tour experience, accommodation comfort, itinerary pace, and guide assistance..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <SubmitButton type="submit" disabled={addReviewLoading}>
              {addReviewLoading
                ? "Submitting Review..."
                : "Submit Verified Review"}
            </SubmitButton>
          </Form>
        )}
      </ConsultationContent>
    </ConsultationCard>
  );
}
