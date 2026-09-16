import {
  LuArrowLeft,
  LuBadgeDollarSign,
  LuCircleX,
  LuCreditCard,
  LuShieldCheck,
  LuFileCheck,
  LuScale,
  LuUsers,
  LuBuilding2,
  LuHeartPulse,
  LuFileText,
  LuCalendarClock,
} from "react-icons/lu";

import {
  Wrapper,
  Container,
  Hero,
  Badge,
  Title,
  Accent,
  Description,
  Updated,
  Layout,
  Sidebar,
  SidebarTitle,
  Nav,
  NavItem,
  Content,
  PolicySection,
  PolicyHeader,
  PolicyTitle,
  PolicyTag,
  Heading,
  Paragraph,
  List,
  ListItem,
  Divider,
  InfoBox,
  InfoTitle,
  InfoText,
  WarningBox,
  WarningTitle,
  WarningText,
  Footer,
  Copyright,
  FooterLinks,
  FooterLink,
  ContactCard,
  ContactTitle,
  ContactText,
  ContactButton,
  BackButton,
} from "./TermsAndPolicy.styles";

const policies = [
  {
    id: "refund",
    title: "Refund Policy",
    icon: LuBadgeDollarSign,
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    icon: LuCircleX,
  },
  {
    id: "payment",
    title: "Payment Policy",
    icon: LuCreditCard,
  },
  {
    id: "insurance",
    title: "Insurance Policy",
    icon: LuShieldCheck,
  },
  {
    id: "documents",
    title: "Document Verification",
    icon: LuFileCheck,
  },
  {
    id: "criminal",
    title: "Criminal & Immigration",
    icon: LuScale,
  },
  {
    id: "traveler",
    title: "Traveler Information",
    icon: LuUsers,
  },
  {
    id: "thirdparty",
    title: "Third Party Services",
    icon: LuBuilding2,
  },
  {
    id: "health",
    title: "Health Declaration",
    icon: LuHeartPulse,
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    icon: LuFileText,
  },
];

function PolicyCenter() {
  return (
    <Wrapper>
      <Container>
        <Hero>
          <Badge>
            <LuFileText />
            Policy Center
          </Badge>

          <Title>
            Travel with <Accent>Confidence</Accent>
          </Title>

          <Description>
            Before booking your journey, please take a few minutes to review
            our policies. These guidelines explain your rights,
            responsibilities, payment procedures, refunds, cancellations,
            travel documentation requirements and other important information
            that helps us provide a safe and transparent travel experience.
          </Description>

          <Updated>
            <LuCalendarClock />
            Last Updated : 03 August 2026
          </Updated>
        </Hero>

        <Layout>

          {/* ================================= */}
          {/* Sidebar */}
          {/* ================================= */}

          <Sidebar>

            <SidebarTitle>
              Quick Navigation
            </SidebarTitle>

            <Nav>

              {policies.map((policy) => {
                const Icon = policy.icon;

                return (
                  <NavItem
                    key={policy.id}
                    href={`#${policy.id}`}
                  >
                    <Icon />

                    {policy.title}
                  </NavItem>
                );
              })}

            </Nav>

          </Sidebar>

          {/* ================================= */}
          {/* Content */}
          {/* ================================= */}

                  <Content>
                                  {/* ======================================================= */}
            {/* REFUND POLICY */}
            {/* ======================================================= */}

            <PolicySection id="refund">
              <PolicyHeader>
                <PolicyTitle>Refund Policy</PolicyTitle>
                <PolicyTag>Booking</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                We strive to provide transparent and fair refund procedures.
                Refund eligibility depends on the selected tour package,
                cancellation date, airline policies, hotel partners, visa
                processing status and other third-party suppliers associated
                with your booking.
              </Paragraph>

              <Divider />

              <Heading>Refund Eligibility</Heading>

              <List>
                <ListItem>
                  Refunds are processed only after the cancellation request has
                  been reviewed and approved.
                </ListItem>

                <ListItem>
                  Airline tickets, hotel reservations and visa charges may be
                  partially or fully non-refundable depending upon supplier
                  policies.
                </ListItem>

                <ListItem>
                  Processing fees, payment gateway charges and government taxes
                  may not be refundable.
                </ListItem>

                <ListItem>
                  Promotional offers, discounted packages and last-minute deals
                  may carry special refund restrictions.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Refund Processing</InfoTitle>

                <InfoText>
                  Approved refunds are normally credited through the original
                  payment method. Processing time depends on banks, payment
                  gateways and third-party suppliers and may require several
                  business days.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Important Notice</WarningTitle>

                <WarningText>
                  Submission of a cancellation request does not automatically
                  guarantee a refund. Refund eligibility is determined only
                  after verification of supplier policies and booking status.
                </WarningText>
              </WarningBox>
            </PolicySection>

            {/* ======================================================= */}
            {/* CANCELLATION POLICY */}
            {/* ======================================================= */}

            <PolicySection id="cancellation">
              <PolicyHeader>
                <PolicyTitle>Cancellation Policy</PolicyTitle>
                <PolicyTag>Travel</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                Cancellation requests are governed by the policies of airlines,
                hotels, transport providers, visa authorities and our travel
                partners. Charges generally increase as the departure date
                approaches.
              </Paragraph>

              <Divider />

              <Heading>Cancellation Guidelines</Heading>

              <List>
                <ListItem>
                  Cancellation requests must be submitted through the official
                  booking portal or authorized customer support.
                </ListItem>

                <ListItem>
                  Certain tour packages may become completely non-refundable
                  after confirmation.
                </ListItem>

                <ListItem>
                  Airlines and hotels may impose separate cancellation charges
                  beyond company service fees.
                </ListItem>

                <ListItem>
                  Visa processing fees and government application charges are
                  generally non-refundable once processing has started.
                </ListItem>

                <ListItem>
                  Tour packages that include event tickets, permits or special
                  reservations may not qualify for cancellation refunds.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Need to Cancel?</InfoTitle>

                <InfoText>
                  Contact our support team as early as possible. Earlier
                  cancellation generally results in lower cancellation charges
                  and improves the likelihood of receiving a refund where
                  applicable.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Please Remember</WarningTitle>

                <WarningText>
                  Failure to arrive at the departure location, missing flights,
                  late reporting or "No Show" situations are generally treated
                  as cancelled bookings and may not qualify for refunds.
                </WarningText>
              </WarningBox>
            </PolicySection>

            {/* ======================================================= */}
            {/* PAYMENT POLICY */}
            {/* ======================================================= */}

            <PolicySection id="payment">
              <PolicyHeader>
                <PolicyTitle>Payment Policy</PolicyTitle>
                <PolicyTag>Payments</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                All bookings are considered provisional until payment has been
                successfully verified. Confirmation emails, hotel reservations
                and travel documents are issued only after successful payment
                authorization.
              </Paragraph>

              <Divider />

              <Heading>Payment Conditions</Heading>

              <List>
                <ListItem>
                  Advance payment may be required to reserve your selected tour
                  package.
                </ListItem>

                <ListItem>
                  Remaining balance must be paid before the due date mentioned
                  in your booking confirmation.
                </ListItem>

                <ListItem>
                  Failed, timed-out or reversed transactions do not guarantee
                  reservation availability.
                </ListItem>

                <ListItem>
                  Prices may change if payment is not completed within the
                  validity period of the quotation.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Secure Payments</InfoTitle>

                <InfoText>
                  We use secure payment gateways to process transactions.
                  Sensitive payment information is handled by certified payment
                  providers and is not stored by our platform.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Failed Transactions</WarningTitle>

                <WarningText>
                  If payment fails after initiating a booking request, booking
                  availability cannot be guaranteed. You may need to complete a
                  new booking at the prevailing price.
                </WarningText>
              </WarningBox>
            </PolicySection>

            {/* ======================================================= */}
            {/* INSURANCE POLICY */}
            {/* ======================================================= */}

            <PolicySection id="insurance">
              <PolicyHeader>
                <PolicyTitle>Insurance Policy</PolicyTitle>
                <PolicyTag>Safety</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                Travel insurance provides financial protection against certain
                unforeseen events during your journey. Coverage varies according
                to the selected insurance provider and policy purchased.
              </Paragraph>

              <Divider />

              <Heading>Insurance Coverage</Heading>

              <List>
                <ListItem>
                  Coverage may include medical emergencies, baggage loss,
                  trip interruption and accidental incidents.
                </ListItem>

                <ListItem>
                  Policy exclusions, claim approval and reimbursement are solely
                  determined by the insurance provider.
                </ListItem>

                <ListItem>
                  Travelers are responsible for reviewing policy terms before
                  departure.
                </ListItem>

                <ListItem>
                  Additional insurance may be recommended for adventure
                  activities or high-risk destinations.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Insurance Claims</InfoTitle>

                <InfoText>
                  Claims must be submitted directly to the insurance provider
                  with all supporting documents. Our company may assist with
                  documentation but cannot approve or reject claims.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Important</WarningTitle>

                <WarningText>
                  Failure to purchase suitable travel insurance may result in
                  significant personal expenses during emergencies occurring
                  while travelling.
                </WarningText>
              </WarningBox>
            </PolicySection>
               
                  {/* ======================================================= */}
            {/* DOCUMENT VERIFICATION */}
            {/* ======================================================= */}

            <PolicySection id="documents">
              <PolicyHeader>
                <PolicyTitle>Document Verification</PolicyTitle>
                <PolicyTag>Verification</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                Every traveler is responsible for submitting genuine, valid and
                complete travel documents before departure. Verification is
                mandatory to ensure compliance with airline regulations,
                immigration authorities and destination country requirements.
              </Paragraph>

              <Divider />

              <Heading>Required Documents</Heading>

              <List>
                <ListItem>
                  Passport with sufficient validity as required by the
                  destination country.
                </ListItem>

                <ListItem>
                  Valid Visa (where applicable).
                </ListItem>

                <ListItem>
                  Government issued National Identification document.
                </ListItem>

                <ListItem>
                  Travel Insurance documents (if required).
                </ListItem>

                <ListItem>
                  Any additional permits, vaccination certificates or travel
                  authorizations requested by local authorities.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Verification Process</InfoTitle>

                <InfoText>
                  Our verification team reviews uploaded documents before
                  confirming your booking. Additional information or corrected
                  documents may be requested if any discrepancy is identified.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Important</WarningTitle>

                <WarningText>
                  Expired, forged, damaged, unreadable or incomplete documents
                  may result in booking cancellation, visa rejection, denied
                  boarding or refusal of entry by immigration authorities.
                </WarningText>
              </WarningBox>
            </PolicySection>

            {/* ======================================================= */}
            {/* CRIMINAL & IMMIGRATION */}
            {/* ======================================================= */}

            <PolicySection id="criminal">
              <PolicyHeader>
                <PolicyTitle>Criminal & Immigration Policy</PolicyTitle>
                <PolicyTag>Legal</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                Every traveler is individually responsible for complying with
                immigration laws, customs regulations and criminal laws of both
                the departure and destination countries.
              </Paragraph>

              <Divider />

              <Heading>Traveler Responsibilities</Heading>

              <List>
                <ListItem>
                  Provide only truthful and accurate personal information during
                  booking.
                </ListItem>

                <ListItem>
                  Never submit forged passports, visas or identity documents.
                </ListItem>

                <ListItem>
                  Comply with customs, immigration and security screening
                  procedures.
                </ListItem>

                <ListItem>
                  Ensure there are no government travel restrictions preventing
                  entry into the destination country.
                </ListItem>

                <ListItem>
                  Follow all applicable laws throughout the duration of the
                  journey.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Legal Compliance</InfoTitle>

                <InfoText>
                  The company cooperates with airlines, immigration authorities
                  and law enforcement agencies whenever legally required.
                  Travelers are expected to comply with all official
                  instructions during their journey.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Company Liability</WarningTitle>

                <WarningText>
                  The company shall not be responsible for visa refusals,
                  deportation, denied boarding, criminal investigations,
                  immigration restrictions, customs violations or any legal
                  consequences arising from false information, forged documents
                  or non-compliance with applicable laws.
                </WarningText>
              </WarningBox>
                  </PolicySection>
                  {/* ======================================================= */}
            {/* TRAVELER INFORMATION */}
            {/* ======================================================= */}

            <PolicySection id="traveler">
              <PolicyHeader>
                <PolicyTitle>Traveler Information Policy</PolicyTitle>
                <PolicyTag>Identity</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                Travelers are responsible for ensuring that all personal,
                contact and travel information provided during booking is
                complete, accurate and exactly matches their official travel
                documents. Incorrect information may result in booking delays,
                denied boarding or additional amendment charges.
              </Paragraph>

              <Divider />

              <Heading>Information Accuracy</Heading>

              <List>
                <ListItem>
                  First name, middle name and last name must exactly match the
                  passport.
                </ListItem>

                <ListItem>
                  Date of birth, gender and nationality must be entered
                  accurately.
                </ListItem>

                <ListItem>
                  Passport number, visa information and national identity
                  details must be valid at the time of travel.
                </ListItem>

                <ListItem>
                  Emergency contact details should always belong to a person
                  who can be reached throughout the journey.
                </ListItem>

                <ListItem>
                  Travelers are responsible for informing the company of any
                  changes before departure.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Data Protection</InfoTitle>

                <InfoText>
                  Personal information is collected solely for booking,
                  reservation, travel documentation, immigration compliance,
                  customer support and legal obligations. Your information is
                  handled in accordance with our Privacy Policy and applicable
                  data protection regulations.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Incorrect Information</WarningTitle>

                <WarningText>
                  Incorrect traveler information may require ticket
                  reissuance, hotel reservation amendments, visa application
                  corrections or complete booking cancellation. Any associated
                  charges shall be borne by the traveler.
                </WarningText>
              </WarningBox>
            </PolicySection>

            {/* ======================================================= */}
            {/* THIRD PARTY SERVICES */}
            {/* ======================================================= */}

            <PolicySection id="thirdparty">
              <PolicyHeader>
                <PolicyTitle>Third Party Services Policy</PolicyTitle>
                <PolicyTag>Partners</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                Our travel packages may include services provided by airlines,
                hotels, transportation companies, local tour operators,
                insurance providers, visa agencies and other independent
                suppliers. These organizations operate under their own terms,
                conditions and operational policies.
              </Paragraph>

              <Divider />

              <Heading>Third Party Responsibilities</Heading>

              <List>
                <ListItem>
                  Flight schedules, delays, cancellations and baggage handling
                  remain the responsibility of the respective airline.
                </ListItem>

                <ListItem>
                  Hotel room allocation, facilities, amenities and check-in
                  procedures are managed by the selected accommodation
                  provider.
                </ListItem>

                <ListItem>
                  Local transportation schedules may change because of traffic,
                  weather conditions or operational requirements.
                </ListItem>

                <ListItem>
                  Tour activities may be modified or cancelled due to safety,
                  government restrictions or environmental conditions.
                </ListItem>

                <ListItem>
                  Insurance claims and approvals are handled exclusively by the
                  selected insurance provider.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Our Commitment</InfoTitle>

                <InfoText>
                  We carefully select trusted travel partners and continuously
                  monitor service quality. Whenever possible, we will assist in
                  coordinating alternative arrangements if disruptions occur
                  during your journey.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Service Availability</WarningTitle>

                <WarningText>
                  The company cannot guarantee uninterrupted services where
                  delays, cancellations, strikes, natural disasters, political
                  events, public health emergencies or other circumstances are
                  beyond our reasonable control. Supplier decisions remain
                  binding and may affect your itinerary.
                </WarningText>
              </WarningBox>
                  </PolicySection>
      
                  {/* ======================================================= */}
            {/* HEALTH DECLARATION */}
            {/* ======================================================= */}

            <PolicySection id="health">
              <PolicyHeader>
                <PolicyTitle>Health Declaration</PolicyTitle>
                <PolicyTag>Safety</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                The health and safety of our travelers remain our highest
                priority. By proceeding with this booking, every traveler
                confirms that they are medically fit to participate in the
                selected tour and have disclosed any condition that may affect
                their journey or require special assistance.
              </Paragraph>

              <Divider />

              <Heading>Traveler Responsibilities</Heading>

              <List>
                <ListItem>
                  Ensure that all travelers are physically and medically fit to
                  participate in the selected itinerary and activities.
                </ListItem>

                <ListItem>
                  Carry sufficient quantities of prescribed medicines throughout
                  the journey along with a valid prescription where required.
                </ListItem>

                <ListItem>
                  Inform the company in advance about disabilities, allergies,
                  chronic illnesses, pregnancy, mobility limitations or any
                  medical condition requiring special arrangements.
                </ListItem>

                <ListItem>
                  Comply with all vaccination, medical examination or health
                  documentation requirements imposed by destination countries or
                  local authorities.
                </ListItem>

                <ListItem>
                  Follow the instructions of tour guides, local authorities,
                  emergency personnel and healthcare professionals whenever
                  necessary.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Medical Assistance</InfoTitle>

                <InfoText>
                  In case of an emergency, our team will make every reasonable
                  effort to coordinate assistance with local hospitals,
                  emergency responders and travel insurance providers. Medical
                  treatment costs remain subject to the traveler's insurance
                  policy and the healthcare provider's charges.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Health Disclaimer</WarningTitle>

                <WarningText>
                  The company shall not be liable for illness, injury,
                  pre-existing medical conditions, allergic reactions,
                  accidents, pandemics, epidemics or other health-related
                  circumstances occurring before, during or after the journey.
                  Travelers participate in tour activities at their own risk and
                  are encouraged to obtain comprehensive travel insurance.
                </WarningText>
              </WarningBox>
            </PolicySection>

            {/* ======================================================= */}
            {/* TERMS & CONDITIONS */}
            {/* ======================================================= */}

            <PolicySection id="terms">
              <PolicyHeader>
                <PolicyTitle>Terms & Conditions</PolicyTitle>
                <PolicyTag>Agreement</PolicyTag>
              </PolicyHeader>

              <Paragraph>
                These Terms & Conditions constitute a legally binding agreement
                between the traveler and our company. By completing a booking,
                making a payment or participating in any tour operated through
                our platform, you acknowledge that you have read, understood and
                accepted the policies described on this page.
              </Paragraph>

              <Divider />

              <Heading>General Agreement</Heading>

              <List>
                <ListItem>
                  All bookings are subject to availability and confirmation from
                  the company and applicable third-party suppliers.
                </ListItem>

                <ListItem>
                  Travelers agree to provide accurate, complete and truthful
                  information throughout the booking process.
                </ListItem>

                <ListItem>
                  The company reserves the right to modify itineraries,
                  accommodation, transportation or tour schedules when required
                  because of operational, safety or regulatory reasons.
                </ListItem>

                <ListItem>
                  Travelers must comply with all applicable laws, immigration
                  regulations and local customs throughout the duration of the
                  tour.
                </ListItem>

                <ListItem>
                  Any misuse of the booking platform, fraudulent activity or
                  submission of false information may result in immediate
                  cancellation of the booking without liability to the company.
                </ListItem>

                <ListItem>
                  The company reserves the right to refuse service where
                  traveler behavior threatens the safety, comfort or experience
                  of other travelers or staff members.
                </ListItem>
              </List>

              <InfoBox>
                <InfoTitle>Acceptance of Policies</InfoTitle>

                <InfoText>
                  By proceeding with your booking, you acknowledge that you have
                  reviewed the Refund Policy, Cancellation Policy, Payment
                  Policy, Insurance Policy, Document Verification Policy,
                  Criminal & Immigration Policy, Traveler Information Policy,
                  Third Party Services Policy and Health Declaration. Your
                  acceptance will be securely recorded together with the booking
                  timestamp, IP address, browser information and the policy
                  version applicable at the time of booking.
                </InfoText>
              </InfoBox>

              <WarningBox>
                <WarningTitle>Legal Notice</WarningTitle>

                <WarningText>
                  These policies are designed to protect both travelers and the
                  company while ensuring compliance with applicable laws and
                  industry standards. Continued use of our services constitutes
                  acceptance of these Terms & Conditions and any future
                  amendments published on this Policy Center.
                </WarningText>
              </WarningBox>
                  </PolicySection>
                  {/* ======================================================= */}
            {/* CONTACT SUPPORT */}
            {/* ======================================================= */}

            <ContactCard>
              <ContactTitle>Still Have Questions?</ContactTitle>

              <ContactText>
                Our travel specialists are available to assist you with booking
                procedures, refund requests, cancellations, document
                verification, payment issues and general travel inquiries.
                Please contact our customer support team before completing your
                booking if you need clarification regarding any policy.
              </ContactText>

              <ContactButton to="/contact">
                Contact Support
              </ContactButton>
            </ContactCard>

            {/* ======================================================= */}
            {/* FAQ */}
            {/* ======================================================= */}

            <PolicySection id="faq">
              <PolicyHeader>
                <PolicyTitle>Frequently Asked Questions</PolicyTitle>
                <PolicyTag>FAQ</PolicyTag>
              </PolicyHeader>

              <Heading>
                1. Can I cancel my booking after confirmation?
              </Heading>

              <Paragraph>
                Yes. Cancellation requests are accepted according to our
                Cancellation Policy. Applicable charges depend on your package,
                departure date and third-party supplier policies.
              </Paragraph>

              <Divider />

              <Heading>
                2. When will I receive my refund?
              </Heading>

              <Paragraph>
                Approved refunds are generally processed using the original
                payment method. Processing time depends upon your bank, payment
                gateway and supplier processing timelines.
              </Paragraph>

              <Divider />

              <Heading>
                3. What happens if my payment fails?
              </Heading>

              <Paragraph>
                Failed or cancelled transactions do not confirm your booking.
                You may retry payment or create a new booking if availability
                still exists.
              </Paragraph>

              <Divider />

              <Heading>
                4. Are my uploaded documents secure?
              </Heading>

              <Paragraph>
                Yes. Documents are used solely for booking verification,
                compliance and travel requirements. They are handled according
                to our privacy and security standards.
              </Paragraph>

              <Divider />

              <Heading>
                5. Why do I need travel insurance?
              </Heading>

              <Paragraph>
                Travel insurance helps protect you against unexpected medical
                emergencies, baggage loss, trip interruptions and other covered
                travel incidents. Coverage depends on your selected insurance
                provider.
              </Paragraph>
            </PolicySection>

            {/* ======================================================= */}
            {/* FOOTER */}
            {/* ======================================================= */}

            <Footer>
              <Copyright>
                © {new Date().getFullYear()} Your Company Name. All Rights
                Reserved.
              </Copyright>

              <FooterLinks>
                <FooterLink to="/privacy-policy">
                  Privacy Policy
                </FooterLink>

                <FooterLink to="/contact">
                  Contact Us
                </FooterLink>

                <FooterLink to="/about">
                  About Us
                </FooterLink>
              </FooterLinks>
            </Footer>

            <BackButton to="/booking/review">
              <LuArrowLeft />
              Back to Booking
            </BackButton>

          </Content>
        </Layout>
      </Container>
    </Wrapper>
  );
}

export default PolicyCenter;