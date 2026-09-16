import useBooking from "../../features/contexts/useBooking";

import {
  Wrapper,
  Main,
  Grid,
  Section,
  SectionTitle,
  InfoGroup,
  InfoRow,
  Label,
  Value,
  PaymentCard,
  PriceRow,
  PriceLabel,
  PriceValue,
  TotalRow,
} from "./TourInformation.styles";

import {
  Container,
  BottomActions,
  PrimaryButton,
} from "./PersonalInfromation.styles";



import { useNavigate } from "react-router-dom";
import useTourDetail from "../../features/hooks/TourHooks/useTourDetail";
import { useEffect } from "react";
import useCurrencyDetector from "../../Services/useCurrencyDetector";

function BookingDetailsFinal() {
  const { bookingData,bookingFiles } = useBooking();
  const navigate = useNavigate();
  const { tour } = useTourDetail();
  const locationString =
    tour?.destinations
      .map((d) => `${d.city || d.state || ""}, ${d.country}`)
      .join(" • ") || "Worldwide";
  useEffect(function () {
    console.log(bookingData);
  }, [bookingData])
  
  const {formatCurrency} = useCurrencyDetector();
  function handleProceed() {
    navigate(`/user/booking/${tour?.slug}/terms-conditions`);
  }
 return (
   <Container>
     <Wrapper>
       <Main>
         <Grid>
           <Section>
             <SectionTitle>Tour Information</SectionTitle>

             <InfoGroup>
               <InfoRow>
                 <Value>
                   {tour?.imageCover ? (
                     <img
                       src={tour?.imageCover}
                       alt={tour?.name}
                       style={{
                         width: "100%",
                         height: "auto",
                         objectFit: "cover",
                         borderRadius: "12px",
                       }}
                     />
                   ) : (
                     "-"
                   )}
                 </Value>
               </InfoRow>

               <InfoRow>
                 <Label>name</Label>
                 <Value>{tour?.name}</Value>
               </InfoRow>

               <InfoRow>
                 <Label>destinations</Label>
                 <Value>{locationString}</Value>
               </InfoRow>

               <InfoRow>
                 <Label>Theme</Label>
                 <Value>{tour?.theme || "-"}</Value>
               </InfoRow>

               <InfoRow>
                 <Label>Package</Label>
                 <Value>{bookingData.packageName}</Value>
               </InfoRow>

               <InfoRow>
                 <Label>Travel Date</Label>
                 <Value>
                   {bookingData.travelDate?.toLocaleDateString() || "-"}
                 </Value>
               </InfoRow>
             </InfoGroup>
           </Section>

           <Section>
             <SectionTitle>Selected Hotel</SectionTitle>

             <InfoGroup>
               <InfoRow>
                 <Label>Hotel Name</Label>
                 <Value>{bookingData.selectedHotel.name || "-"}</Value>
               </InfoRow>

               <InfoRow>
                 <Label>Rating</Label>
                 <Value>{bookingData.selectedHotel.rating} ★</Value>
               </InfoRow>

               <InfoRow>
                 <Label>Room Type</Label>
                 <Value>{bookingData.selectedHotel.roomType || "-"}</Value>
               </InfoRow>

               <InfoRow>
                 <Label>Website</Label>
                 <Value>{bookingData.selectedHotel.website || "-"}</Value>
               </InfoRow>
             </InfoGroup>
           </Section>
         </Grid>

         {/* ========================= */}
         {/* Travelers */}
         {/* ========================= */}

         <SectionTitle style={{ margin: "3rem 0 2rem" }}>
           Travelers
         </SectionTitle>

         <Grid>
           {bookingData.travelers.map((traveler, index) => (
             <Section key={index}>
               <SectionTitle>Traveler {index + 1}</SectionTitle>

               <InfoGroup>
                 <InfoRow>
                   <Label>Name</Label>
                   <Value>
                     {traveler.firstName} {traveler.lastName}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Gender</Label>
                   <Value>{traveler.gender || "-"}</Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Date of Birth</Label>
                   <Value>{traveler.dob?.toLocaleDateString() || "-"}</Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Age</Label>
                   <Value>{traveler.ageAtBooking || "-"}</Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Nationality</Label>
                   <Value>{traveler.nationality || "-"}</Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Phone</Label>
                   <Value>{traveler.phoneNumber || "-"}</Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Passport Number</Label>
                   <Value>
                     {traveler.travelDocuments.passport.number || "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Passport Expiry</Label>
                   <Value>
                     {traveler.travelDocuments.passport.expiry?.toLocaleDateString() ||
                       "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Passport Copy</Label>
                   <Value>
                     {bookingFiles?.[`traveler_${index}_passport`]
                       ? "Uploaded"
                       : "Not Uploaded"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>National ID</Label>
                   <Value>
                     {traveler.travelDocuments.nationalId.type || "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>ID Number</Label>
                   <Value>
                     {traveler.travelDocuments.nationalId.number || "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>ID Copy</Label>
                   <Value>
                     {bookingFiles?.[`traveler_${index}_nationalId`]
                       ? "Uploaded"
                       : "Not Uploaded"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Visa Number</Label>
                   <Value>{traveler.travelDocuments.visa.number || "-"}</Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Visa Expiry</Label>
                   <Value>
                     {traveler.travelDocuments.visa.expiry
                       ? new Date(
                           traveler.travelDocuments.visa.expiry,
                         ).toLocaleDateString()
                       : "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Visa Copy</Label>
                   <Value>
                     {bookingFiles?.[`traveler_${index}_visa`]
                       ? "Uploaded"
                       : "Not Uploaded"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Insurance Provider</Label>
                   <Value>
                     {traveler.travelDocuments.insurance.provider || "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Policy Number</Label>
                   <Value>
                     {traveler.travelDocuments.insurance.policyNumber || "-"}
                   </Value>
                 </InfoRow>

                 <InfoRow>
                   <Label>Insurance Copy</Label>
                   <Value>
                     {bookingFiles?.[`traveler_${index}_insurance`]
                       ? "Uploaded"
                       : "Not Uploaded"}
                   </Value>
                 </InfoRow>
               </InfoGroup>
             </Section>
           ))}
         </Grid>
         <Section style={{ marginTop: "3rem" }}>
           <SectionTitle>Emergency Contact</SectionTitle>

           <InfoGroup>
             <InfoRow>
               <Label>Name</Label>
               <Value>{bookingData.emergencyContact.name || "-"}</Value>
             </InfoRow>

             <InfoRow>
               <Label>Relation</Label>
               <Value>{bookingData.emergencyContact.relation || "-"}</Value>
             </InfoRow>

             <InfoRow>
               <Label>Phone Number</Label>
               <Value>{bookingData.emergencyContact.phoneNumber || "-"}</Value>
             </InfoRow>
           </InfoGroup>
         </Section>

         <PaymentCard>
           <SectionTitle>Booking Summary</SectionTitle>

           <PriceRow>
             <PriceLabel>Package</PriceLabel>
             <PriceValue>{bookingData.packageName}</PriceValue>
           </PriceRow>

           <PriceRow>
             <PriceLabel>Travelers</PriceLabel>
             <PriceValue>{bookingData.travelers.length}</PriceValue>
           </PriceRow>

           <PriceRow>
             <PriceLabel>Price Per Person</PriceLabel>
             <PriceValue>
               {formatCurrency(bookingData.pricePerPerson)}
             </PriceValue>
           </PriceRow>

           <PriceRow>
             <PriceLabel>Total Amount</PriceLabel>
             <PriceValue>{formatCurrency(bookingData.totalAmount)}</PriceValue>
           </PriceRow>

           <PriceRow>
             <PriceLabel>Amount To Be Paid</PriceLabel>
             <PriceValue>
               {formatCurrency(
                 bookingData.totalAmount - bookingData.remainingAmount,
               )}
             </PriceValue>
           </PriceRow>

           <TotalRow>
             <PriceLabel>Remaining Amount</PriceLabel>
             <PriceValue>
               {formatCurrency(bookingData.remainingAmount)}
             </PriceValue>
           </TotalRow>

           <BottomActions>
             <PrimaryButton type="button" onClick={handleProceed}>
               Proceed to Tearms
             </PrimaryButton>
           </BottomActions>
         </PaymentCard>
       </Main>
     </Wrapper>
   </Container>
 );
}

export default BookingDetailsFinal;

