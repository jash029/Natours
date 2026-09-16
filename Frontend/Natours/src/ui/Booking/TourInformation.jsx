import { HiOutlineCheckCircle,HiOutlineCalendarDays } from "react-icons/hi2";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import useTourDetail from "../../features/hooks/TourHooks/useTourDetail";
import  useBooking  from "../../features/contexts/useBooking";
import useCurrencyDetector from "../../Services/useCurrencyDetector";
import {
  Wrapper,
  Header,
  Title,
  Description,
  Grid,
  Section,
  SectionTitle,
  InfoGroup,
  InfoRow,
  Label,
  Value,
  Chips,
  Chip,
  FeatureList,
  FeatureItem,
  PaymentCard,
  PriceRow,
  PriceLabel,
  PriceValue,
  TotalRow,
  Button,
  ErrorMessage,
  HelperText,
  DatePickerWrapper,
  Radio,
} from "./TourInformation.styles";

const TourInformation = () =>
{
 
  const { bookingData,setBookingData} = useBooking();
  const navigate = useNavigate();
 const {formatCurrency} =useCurrencyDetector();
  const [searchParams] = useSearchParams();
  const packageName = searchParams.get("package");

  const { tour, isPending } = useTourDetail();


  // const {
  //   discount = 0,
  //   advanceBookingAmount = 0
  // } = tour;
  
  const selectedPackage = tour?.packages.find(
    (pkg) => pkg.name === packageName,
  );

  const basePrice = selectedPackage?.price;
  const effectivePrice = Math.max(0, basePrice - tour?.discount);
  // const discountPercent =
  //   basePrice > 0 ? Math.round((discount / basePrice) * 100) : 0;
  const offlineBalance = Math.max(0, effectivePrice - tour?.advanceBookingAmount);

 const {
   register,
   control,
   handleSubmit,
   watch,
   reset,
   formState: { errors },
 } = useForm({
   defaultValues: {
     hotel: "",
     travelDate: null,
   },
 });

 useEffect(() => {
   if (!selectedPackage) return;

   
  reset({
    hotel:
      selectedPackage.hotels.find(
        (hotel) => hotel.name === bookingData.selectedHotel?.name,
      )?.name ??
      selectedPackage.hotels[0]?.name ??
      "",

    travelDate: bookingData.travelDate,
  });
 }, [selectedPackage, bookingData, reset]);

  
  if (isPending) return <h2>Loading...</h2>;
  if (!tour) return null;
  if (!selectedPackage) return <h2>Selected package not found.</h2>;

  const remainingBalance = Math.max(
    effectivePrice-offlineBalance,
    0,
  );

  const minimumDate = new Date();
  minimumDate.setDate(minimumDate.getDate() + 4);

  const selectedHotelName = watch("hotel");

const selectedHotel =
  selectedPackage.hotels?.find((hotel) => hotel.name === selectedHotelName) ??
  selectedPackage.hotels?.[0] ??
    null;
  
  function onSubmit(data)
  {

   setBookingData((prev) => ({
     ...prev,

     tourId: tour._id,
     packageName:selectedPackage.name,
    pricePerPerson:effectivePrice,
    remainingAmountPerPerson:remainingBalance,

     selectedHotel,


     travelDate: data.travelDate,
   }));

   
   navigate(`/user/booking/${tour.slug}/personal-info`);
 }

  return (
    <Wrapper>
      <Header>
        <Title>Booking Details</Title>

        <Description>
          Review your selected tour, choose your hotel and travel date before
          continuing to traveler information.
        </Description>
      </Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          {/* ================= Tour Information ================= */}

          <Section>
            <SectionTitle>Tour Information</SectionTitle>

            <InfoGroup>
              <InfoRow>
                <Label>Tour Name</Label>
                <Value>{tour.name}</Value>
              </InfoRow>

              <InfoRow>
                <Label>Theme</Label>
                <Value>{tour.theme}</Value>
              </InfoRow>

              <InfoRow>
                <Label>Duration</Label>

                <Value>
                  {tour.duration.days} Days • {tour.duration.nights} Nights
                </Value>
              </InfoRow>

              <InfoRow>
                <Label>Starting From</Label>
                <Value>{tour.startLocation}</Value>
              </InfoRow>

              <InfoRow>
                <Label>Destinations</Label>

                <Chips>
                  {tour.destinations.map((destination) => (
                    <Chip key={`${destination.country}-${destination.city}`}>
                      {destination.city}
                    </Chip>
                  ))}
                </Chips>
              </InfoRow>
            </InfoGroup>
          </Section>

          {/* ================= Package ================= */}

          <Section>
            <SectionTitle>Selected Package</SectionTitle>

            <InfoGroup>
              <InfoRow>
                <Label>Package</Label>

                <Value>
                  <Chip>{selectedPackage.name}</Chip>
                </Value>
              </InfoRow>

              <InfoRow>
                <Label>Transportation</Label>
                <Value>{selectedPackage.transportation}</Value>
              </InfoRow>

              <InfoRow>
                <Label>Meals</Label>

                <Value>
                  {selectedPackage.meals.length
                    ? selectedPackage.meals.join(", ")
                    : "Not Included"}
                </Value>
              </InfoRow>

              <InfoRow>
                <Label>Support</Label>
                <Value>{selectedPackage.assistance}</Value>
              </InfoRow>

              <InfoRow>
                <Label>Room Type</Label>

                <Value>{selectedHotel?.roomType}</Value>
              </InfoRow>
            </InfoGroup>
          </Section>

          {/* ================= Hotel Selection ================= */}

          <Section>
            <SectionTitle>Select Hotel</SectionTitle>

            <InfoGroup>
              {selectedPackage.hotels.map((hotel) => (
                <InfoRow key={hotel.name}>
                  <Label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <Radio
                      type="radio"
                      value={hotel.name}
                      {...register("hotel", {
                        required: "Please select a hotel.",
                      })}
                    />

                    <p style={{ cursor: "auto" }}>{hotel.name}</p>
                  </Label>
                </InfoRow>
              ))}

              {errors.hotel && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "1.3rem",
                  }}
                >
                  {errors.hotel.message}
                </span>
              )}
            </InfoGroup>
          </Section>

          {/* ================= Travel Date ================= */}

          <Section>
            <SectionTitle>Select Travel Date</SectionTitle>

            <InfoGroup>
              <Label>Select Your Travel Date</Label>

              <DatePickerWrapper $error={!!errors.travelDate}>
                <HiOutlineCalendarDays />

                <Controller
                  name="travelDate"
                  control={control}
                  rules={{
                    required: "Please select your travel date.",
                    validate: (value) =>
                      value >= minimumDate ||
                      "Travel date must be at least 4 days from today.",
                  }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      minDate={minimumDate}
                      dateFormat="dd MMMM yyyy"
                      placeholderText="Choose your departure date"
                      showPopperArrow={false}
                      isClearable
                      calendarStartDay={1}
                    />
                  )}
                />
              </DatePickerWrapper>

              <HelperText>
                Earliest available departure:{" "}
                <strong>
                  {minimumDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </HelperText>

              {errors.travelDate && (
                <ErrorMessage>{errors.travelDate.message}</ErrorMessage>
              )}
            </InfoGroup>
          </Section>

          {/* ================= Extra Facilities ================= */}

          <Section>
            <SectionTitle>Extra Facilities</SectionTitle>

            <FeatureList>
              {selectedPackage.extraFacilities.map((facility) => (
                <FeatureItem key={facility}>
                  <HiOutlineCheckCircle />
                  <span>{facility}</span>
                </FeatureItem>
              ))}
            </FeatureList>
          </Section>

          {/* ================= Payment Summary ================= */}

          <PaymentCard>
            <SectionTitle>Payment Summary</SectionTitle>

            <PriceRow>
              <PriceLabel>Package Price /person</PriceLabel>
              <PriceValue>{formatCurrency(effectivePrice)}</PriceValue>
            </PriceRow>

            <PriceRow>
              <PriceLabel>Advance Payment /person</PriceLabel>
              <PriceValue>
                {formatCurrency(offlineBalance)}
              </PriceValue>
            </PriceRow>

            <TotalRow>
              <PriceLabel>Remaining Balance /person</PriceLabel>
              <PriceValue>{formatCurrency(remainingBalance)}</PriceValue>
            </TotalRow>

            <Button as="button" type="submit">
              Continue
            </Button>
          </PaymentCard>
        </Grid>
      </form>
    </Wrapper>
  );
};

export default TourInformation;