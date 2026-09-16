import {
  Card,
  Header,
  Status,
  Title,
  Category,
  Body,
  Row,
  Label,
  Value,
  Message,
  Footer,
  DateText,
  EmptyResponse,
} from "./BookingCard.styles";

function BookingCardQuery({ query }) {
  const {
    _id,
    booking,
    category,
    subject,
    message,
    status,
    contactPreference,
    responses,
    createdAt,
    updatedAt,
    user
  } = query;

  return (
    <Card>
      <Header>
        <div>
          <Title>{subject}</Title>
          <Category>{category}</Category>
        </div>

        <Status status={status}>{status}</Status>
      </Header>

      <Body>
        <Row>
          <Label>Query ID</Label>
          <Value>{_id}</Value>
        </Row>

        <Row>
          <Label>Name</Label>
          <Value>{user?.name || ""}</Value>
        </Row>

        <Row>
          <Label>Booking ID</Label>
          <Value>{booking.bookingNumber}</Value>
        </Row>

        <Row>
          <Label>Contact Preference</Label>
          <Value>{contactPreference}</Value>
        </Row>

        <Row>
          <Label>Status</Label>
          <Value>{status}</Value>
        </Row>

        <Row>
          <Label>Responses</Label>
          <Value>
            {responses.length > 0 ? responses.length : "Will Resolve Soon"}
          </Value>
        </Row>

        <Message>
          <Label>Message</Label>

          <p>{message}</p>
        </Message>

        {responses.length === 0 && (
          <EmptyResponse>
            No response has been added by our support team yet.
          </EmptyResponse>
        )}
      </Body>

      <Footer>
        <DateText>
          Created :
          <br />
          {new Date(createdAt).toLocaleString()}
        </DateText>

       
        <DateText>
          Updated :
          <br />
          {new Date(updatedAt).toLocaleString()}
        </DateText>
      </Footer>
    </Card>
  );
}

export default BookingCardQuery;
