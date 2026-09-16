import { useState, useEffect, useRef } from "react";
import BookingContext from "./Context";
import { useParams,useSearchParams } from "react-router-dom";



const STORAGE_KEY = "booking-data";
const EXPIRY_TIME = 0.5 * 60 * 60 * 1000; // 30 Minutes

const initialTraveler = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: null,
  ageAtBooking: "",
  nationality: "",
  phoneNumber: "",

  travelDocuments: {
    passport: {
      number: "",
      expiry: null,
      file: null,
    },

    nationalId: {
      type: "",
      number: "",
      file: null,
    },

    visa: {
      number: "",
      expiry: null,
      file: null,
    },

    insurance: {
      provider: "",
      policyNumber: "",
      file: null,
    },
  },
};

const initialBookingData = {
  packageName: "",

  selectedHotel: {
    name: "",
    rating: 0,
    website: "",
    roomType: "",
  },

  travelDate: null,

  travelers: [structuredClone(initialTraveler)],

  pricePerPerson: 0,
  remainingAmountPerPerson: 0,
  totalAmount: 0,
  amountPaid: 0,
  remainingAmount: 0,

  emergencyContact: {
    name: "",
    relation: "",
    phoneNumber: "",
  },

  terms: {
    refundPolicy: false,
    cancellationPolicy: false,
    failedPaymentPolicy: false,
    insurancePolicy: false,
    documentVerificationPolicy: false,
    criminalAndImmigrationPolicy: false,
    travelerInformationPolicy: false,
    thirdPartyServicesPolicy: false,
    healthDeclarationPolicy: false,
    termsAndConditions: false,

    acceptedAt: null,
    ipAddress: "",
    acceptedVersion: "v1.0",
  },

  payment: {
    provider: "card",
    status: "pending",
    paidAt: null,
  },
};

function loadBookingData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialBookingData;

    const parsed = JSON.parse(saved);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return initialBookingData;
    }

    const data = parsed.data;

    data.travelDate = data.travelDate ? new Date(data.travelDate) : null;

    data.travelers = data.travelers.map((traveler) => ({
      ...traveler,

      dob: traveler.dob ? new Date(traveler.dob) : null,

      travelDocuments: {
        ...traveler.travelDocuments,

        passport: {
          ...traveler.travelDocuments.passport,

          expiry: traveler.travelDocuments.passport.expiry
            ? new Date(traveler.travelDocuments.passport.expiry)
            : null,
        },

        visa: {
          ...traveler.travelDocuments.visa,

          expiry: traveler.travelDocuments.visa.expiry
            ? new Date(traveler.travelDocuments.visa.expiry)
            : null,
        },
      },
    }));

    return data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return initialBookingData;
  }
}

function BookingProvider({ children }) {
  // Booking information (stored in localStorage)
  const hasCheckedReload = useRef(false);
  const [bookingData, setBookingData] = useState(loadBookingData);
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  // Real File objects (NOT stored in localStorage)
  const [bookingFiles, setBookingFiles] = useState({});
  //  const packageName = searchParams.get("package") || bookingData?.packageName;
  
  useEffect(() => {
    if (hasCheckedReload.current) return;

    hasCheckedReload.current = true;

    const navigationEntries = performance.getEntriesByType("navigation");

    const isReload =
      navigationEntries.length > 0 && navigationEntries[0].type === "reload";

    if (!isReload) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const packageName =
      searchParams.get("package") || JSON.parse(saved).data.packageName;
    alert(
      "For security reasons, uploaded documents cannot be restored after refreshing the page. Please complete the booking forms again.",
    );

    // Clear storage first
    localStorage.removeItem(STORAGE_KEY);

    // Clear in-memory state
    setBookingFiles({});
    setBookingData(structuredClone(initialBookingData));

    // Then redirect
    window.location.replace(
      `/user/booking/${slug}/tour-information?package=${packageName}`,
    );
  }, [slug, searchParams]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        data: bookingData,
        expiresAt: Date.now() + EXPIRY_TIME,
      }),
    );
  }, [bookingData]);

  function clearBooking() {
    localStorage.removeItem(STORAGE_KEY);

    setBookingData(structuredClone(initialBookingData));

    // Clear uploaded files
    setBookingFiles({});
  }

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,

        bookingFiles,
        setBookingFiles,

        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export default BookingProvider;
