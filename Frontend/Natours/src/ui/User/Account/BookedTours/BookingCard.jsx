import { Link } from "react-router-dom";
import {
  Card,
  Image,
  Content,
  TourName,
  Status,
  Grid,
  Item,
  Label,
  Value,
  Footer,
  Amount,
  Remaining,
  Button,
} from "./BookingCard.styles";
import useCurrencyDetector from "../../../../Services/useCurrencyDetector";
function BookingCard({ booking }) {
  const {
    tour,
    packageName,
    travelers = [],
    bookingStatus,
    amountPaid,
    remainingAmount,
    payment,
    createdAt,
    travelDate,
  } = booking;
  const {formatCurrency} = useCurrencyDetector();
  return (
    <Card>
      <Image src={tour.imageCover?.secureUrl} alt={tour.name} />

      <Content>
        <TourName>{tour.name}</TourName>

        {bookingStatus==="pending" ? (
          <>
          <Status status={bookingStatus}>Booking status : {bookingStatus}</Status>
              <p style={{color : "#f04526",fontSize : "12px",marginBottom : "1rem"}}>The Document verificaation may take 2 or more Days , Please Stay Updated !</p>
              </>
        ): (
          <Status status={bookingStatus}>Booking status : {bookingStatus}</Status>
        )}

        <Grid>
          <Item>
            <Label>Package</Label>
            <Value>{packageName}</Value>
          </Item>

          <Item>
            <Label>Travelers</Label>
            <Value>{travelers.length}</Value>
          </Item>

          <Item>
            <Label>Travel Date</Label>
            <Value>
              {travelDate ? new Date(travelDate).toLocaleDateString() : "-"}
            </Value>
          </Item>

          <Item>
            <Label>Booked On</Label>
            <Value>{new Date(createdAt).toLocaleDateString()}</Value>
          </Item>
        </Grid>

        <Footer>
          <div>
            <Amount>{formatCurrency(amountPaid)}</Amount>

            {remainingAmount > 0 && (
              <Remaining>
                Remaining {formatCurrency(remainingAmount)}
              </Remaining>
            )}

            <Value>Payment : {payment?.status}</Value>
          </div>

          <Button as={Link} to={`/user/booking/${tour.slug}/${booking._id}`}>
            View Booking
          </Button>
        </Footer>
      </Content>
    </Card>
  );
}

export default BookingCard;
