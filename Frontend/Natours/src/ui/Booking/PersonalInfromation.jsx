import { useMemo, forwardRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Section,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  SelectOp,
  Input,
  StyledDatePicker,
  Error,
  ButtonGroup,
  BottomActions,
  PrimaryButton,
  SecondaryButton,
} from "./PersonalInfromation.styles";

import useBooking from "../../features/contexts/useBooking";
import useTourDetail from "../../features/hooks/TourHooks/useTourDetail";

const emptyTraveler = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: null,
  ageAtBooking: "",
  nationality: "",
  phoneNumber: "",

  // emergencyContact: {
  //   name: "",
  //   relation: "",
  //   phoneNumber: "",
  // },

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

function PersonalInformation() {
  const navigate = useNavigate();
  const { tour } = useTourDetail();
  const { bookingData, setBookingData, setBookingFiles,bookingFiles } = useBooking();
  
  const countryOptions = useMemo(() => countryList().getData(), []);

 const {
  register,
   control,
   reset,
  watch,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm({
    defaultValues: {
      travelers:
        bookingData.travelers?.length > 0
          ? bookingData.travelers
          : [structuredClone(emptyTraveler)],
    },
});
  
  

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travelers",
  });
  const travelers = watch("travelers");
  useEffect(() => {
   const travelers = structuredClone(bookingData.travelers);

  //  travelers.forEach((traveler) => {
  //    traveler.travelDocuments.passport.file = null;
  //    traveler.travelDocuments.nationalId.file = null;
  //    traveler.travelDocuments.visa.file = null;
  //    traveler.travelDocuments.insurance.file = null;
  //  });

   reset({
     travelers,
     emergencyContact: bookingData.emergencyContact,
   });
  }, [bookingData, reset ]);

  function calculateAge(date) {
    if (!date) return "";

    const birth = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const month = today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  function handleDOB(index, value) {
    setValue(`travelers.${index}.dob`, value);
    setValue(
      `travelers.${index}.ageAtBooking`,
      calculateAge(value)
    );
  }

  function addTraveler() {
    append(structuredClone(emptyTraveler));
  }

  function removeTraveler(index) {
    if (fields.length === 1) return;
    remove(index);
  }

  

  function onSubmit(data) {
    // Store actual File objects for upload
    

    const bookingFiles = extractBookingFiles(data.travelers);
console.log("Extracted files:");
Object.entries(bookingFiles).forEach(([key, value]) => {
  console.log(key, value);
  console.log("instanceof File:", value instanceof File);
});
    console.log(bookingFiles);
    setBookingFiles(bookingFiles);


    setBookingData((prev) => ({
      ...prev,

      travelers,

      emergencyContact: data.emergencyContact,

      totalAmount: prev.pricePerPerson * travelers.length,

      remainingAmount: prev.remainingAmountPerPerson * travelers.length,

      amountPaid:
        prev.pricePerPerson * travelers.length -
        prev.remainingAmountPerPerson * travelers.length,
    }));

    // We'll replace this later with BookingFilesContext
    console.log("Files", bookingFiles);

    navigate(`/user/booking/${tour?.slug}/review-details`);
  }

 
  const documentRules = {
    passport: true,
    nationalId: true,
    visa: true,
    healthInsurance: true,
  };


  const PhoneNumberInput = forwardRef((props, ref) => (
    <input
      ref={ref}
      {...props}
      style={{
        backgroundColor: "transparent",
        color: "#ffffff",
        border: "none",
        outline: "none",
        width: "100%",
        fontSize: "15px",
      }}
    />
  ));

  PhoneNumberInput.displayName = "PhoneNumberInput";
  
  function extractBookingFiles(travelers) {
    const files = {};

    travelers.forEach((traveler, index) => {
      files[`traveler_${index}_passport`] =
        traveler.travelDocuments.passport.file ?? null;

      files[`traveler_${index}_nationalId`] =
        traveler.travelDocuments.nationalId.file ?? null;

      files[`traveler_${index}_visa`] =
        traveler.travelDocuments.visa.file ?? null;

      files[`traveler_${index}_insurance`] =
        traveler.travelDocuments.insurance.file ?? null;
    });

    return files;
  }

  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <Section key={field.id}>
          <SectionTitle>Traveler {index + 1}</SectionTitle>

          {/* ========================= */}
          {/* Personal Information */}
          {/* ========================= */}

          <FormGrid>
            <FormGroup>
              <Label>First Name *</Label>

              <Input
                type="text"
                placeholder="Enter first name"
                {...register(`travelers.${index}.firstName`, {
                  required: "First name is required",
                })}
              />

              <Error>{errors.travelers?.[index]?.firstName?.message}</Error>
            </FormGroup>

            <FormGroup>
              <Label>Last Name *</Label>

              <Input
                type="text"
                placeholder="Enter last name"
                {...register(`travelers.${index}.lastName`, {
                  required: "Last name is required",
                })}
              />

              <Error>{errors.travelers?.[index]?.lastName?.message}</Error>
            </FormGroup>

            <FormGroup>
              <Label>Gender *</Label>

              <SelectOp
                {...register(`travelers.${index}.gender`, {
                  required: "Gender is required",
                })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </SelectOp>

              <Error>{errors.travelers?.[index]?.gender?.message}</Error>
            </FormGroup>

            <FormGroup>
              <Label>Date of Birth *</Label>

              <Controller
                control={control}
                name={`travelers.${index}.dob`}
                rules={{
                  required: "Date of birth is required",
                }}
                render={({ field }) => (
                  <StyledDatePicker
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      handleDOB(index, date);
                    }}
                    dateFormat="dd MMM yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select DOB"
                    maxDate={new Date("12/31/2024")}
                  />
                )}
              />

              <Error>{errors.travelers?.[index]?.dob?.message}</Error>
            </FormGroup>

            <FormGroup>
              <Label>Age</Label>

              <Input
                readOnly
                {...register(`travelers.${index}.ageAtBooking`)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Nationality *</Label>
              <Controller
                name={`travelers.${index}.nationality`}
                control={control}
                rules={{
                  required: "Nationality is required",
                }}
                render={({ field }) => (
                  <Select
                    options={countryOptions}
                    value={
                      countryOptions.find(
                        (country) => country.value === field.value,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value)
                    }
                    placeholder="Select Nationality"
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: 52,
                        backgroundColor: "#111111",
                        borderColor: "#3d4755",
                        borderRadius: 14,
                        boxShadow: "none",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#fff",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#fff",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#9ca3af",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#111111",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#2183eb"
                          : "#111111",
                        color: "#fff",
                        cursor: "pointer",
                      }),
                    }}
                  />
                )}
              />

              <Error>{errors.travelers?.[index]?.nationality?.message}</Error>
            </FormGroup>
          </FormGrid>

          {/* ========================= */}
          {/* Contact Information */}
          {/* ========================= */}

          <SectionTitle>Contact Information</SectionTitle>

          <FormGrid>
            <FormGroup>
              <Label>Phone Number *</Label>

              <Controller
                name={`travelers.${index}.phoneNumber`}
                control={control}
                rules={{
                  required: "Phone number is required",
                  validate: (value) =>
                    (value && value.length > 5) || "Enter a valid phone number",
                }}
                render={({ field }) => (
                  <>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={field.value}
                      onChange={field.onChange}
                      style={{
                        backgroundColor: "#111111",
                        color: "#ffffff",
                        border: "1px solid #3d4755",
                        borderRadius: "14px",
                        padding: "12px 16px",
                      }}
                      inputComponent={PhoneNumberInput}
                    />

                    <Error>
                      {errors.travelers?.[index]?.phoneNumber?.message}
                    </Error>
                  </>
                )}
              />
            </FormGroup>
          </FormGrid>

          {/* ========================= */}
          {/* Emergency Contact */}
          {/* ========================= */}

          {index === 0 && (
            <>
              <SectionTitle>Emergency Contact</SectionTitle>

              <FormGrid>
                <FormGroup>
                  <Label>Contact Name *</Label>

                  <Input
                    type="text"
                    placeholder="Full Name"
                    {...register(`emergencyContact.name`, {
                      required: "Emergency contact is required",
                    })}
                  />

                  <Error>{errors.emergencyContact?.name?.message}</Error>
                </FormGroup>

                <FormGroup>
                  <Label>Relationship *</Label>

                  <Input
                    type="text"
                    placeholder="Father / Mother / Friend"
                    {...register(`emergencyContact.relation`, {
                      required: "Relationship is required",
                    })}
                  />

                  <Error>{errors.emergencyContact?.relation?.message}</Error>
                </FormGroup>

                <FormGroup>
                  <Label>Emergency Phone *</Label>

                  <Controller
                    name={`emergencyContact.phoneNumber`}
                    control={control}
                    rules={{
                      required: "Emergency phone is required",
                      validate: (value) =>
                        (value && value.length > 5) ||
                        "Enter a valid phone number",
                    }}
                    render={({ field }) => (
                      <>
                        <PhoneInput
                          international
                          defaultCountry={`IN`}
                          value={field.value}
                          onChange={field.onChange}
                          style={{
                            backgroundColor: "#111111",
                            color: "#ffffff",
                            border: "1px solid #3d4755",
                            borderRadius: "14px",
                            padding: "12px 16px",
                          }}
                          inputComponent={PhoneNumberInput}
                        />

                        <Error>
                          {errors.emergencyContact?.phoneNumber?.message}
                        </Error>
                      </>
                    )}
                  />
                </FormGroup>
              </FormGrid>
            </>
          )}
          {/* ========================= */}
          {/* Documents */}
          {/* ========================= */}

          <SectionTitle>Travel Documents</SectionTitle>

          <FormGrid>
            {/* Passport */}

            {documentRules.passport && (
              <>
                <FormGroup>
                  <Label>Passport Number *</Label>

                  <Input
                    type="text"
                    placeholder="Enter passport number"
                    {...register(
                      `travelers.${index}.travelDocuments.passport.number`,
                      {
                        required: "Passport number is required",
                      },
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.passport
                        ?.number?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Passport Expiry *</Label>

                  <Controller
                    control={control}
                    name={`travelers.${index}.travelDocuments.passport.expiry`}
                    rules={{
                      required: "Passport expiry is required",
                      validate: (value) =>
                        value >= new Date("2028-03-05") ||
                        "Passport expiry must be on or after 05 Mar 2028",
                    }}
                    render={({ field }) => (
                      <StyledDatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd MMM yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="Select Passport Expiry"
                      />
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.passport
                        ?.expiry?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Passport Copy *</Label>

                  <Controller
                    control={control}
                    name={`travelers.${index}.travelDocuments.passport.file`}
                    rules={{
                      required: "Passport copy is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />

                        {bookingFiles?.[`traveler_${index}_passport`] && (
                          <p
                            style={{
                              color: "#22c55e",
                              marginTop: "8px",
                              fontSize: "14px",
                            }}
                          >
                            ✓{" "}
                            {
                              bookingFiles?.[`traveler_${index}_passport`]?.file?.name
                            }
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.passport?.file
                        ?.message
                    }
                  </Error>
                </FormGroup>
              </>
            )}

            {/* National ID */}

            {documentRules.nationalId && (
              <>
                <FormGroup>
                  <Label>National ID Type *</Label>

                  <SelectOp
                    {...register(
                      `travelers.${index}.travelDocuments.nationalId.type`,
                      {
                        required: "Select ID type",
                      },
                    )}
                  >
                    <option value="">Select</option>
                    <option value="voterId">Voter ID</option>
                    <option value="drivingLicence">Driving Licence</option>
                    <option value="uniqueId">UniqueId Card</option>
                    <option value="other">Other ID Proof</option>
                  </SelectOp>

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.nationalId
                        ?.type?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>ID Number *</Label>

                  <Input
                    type="text"
                    {...register(
                      `travelers.${index}.travelDocuments.nationalId.number`,
                      {
                        required: "ID number is required",
                      },
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.nationalId
                        ?.number?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Upload ID *</Label>

                  <Controller
                    control={control}
                    name={`travelers.${index}.travelDocuments.nationalId.file`}
                    rules={{
                      required: "Upload ID proof",
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />

                        {bookingFiles?.[`traveler_${index}_nationalId`] && (
                          <p
                            style={{
                              color: "#22c55e",
                              marginTop: "8px",
                              fontSize: "14px",
                            }}
                          >
                            ✓{" "}
                            {
                              bookingFiles?.[`traveler_${index}_nationalId`]?.name
                            }
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.nationalId
                        ?.file?.message
                    }
                  </Error>
                </FormGroup>
              </>
            )}

            {/* Visa */}

            {documentRules.visa && (
              <>
                <FormGroup>
                  <Label>Visa Number *</Label>

                  <Input
                    type="text"
                    {...register(
                      `travelers.${index}.travelDocuments.visa.number`,
                      {
                        required: "Visa number is required",
                      },
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.visa?.number
                        ?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Visa Expiry *</Label>

                  <Input
                    type="date"
                    {...register(
                      `travelers.${index}.travelDocuments.visa.expiry`,
                      {
                        required: "Visa expiry is required",
                        validate: (value) =>
                          new Date(value) >= new Date("2027-01-01") ||
                          "Visa expiry must be on or after 01 Jan 2027",
                      },
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.visa?.expiry
                        ?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Visa Copy *</Label>

                  <Controller
                    control={control}
                    name={`travelers.${index}.travelDocuments.visa.file`}
                    rules={{
                      required: "Visa document is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />

                        {bookingFiles?.[`traveler_${index}_visa`] && (
                          <p
                            style={{
                              color: "#22c55e",
                              marginTop: "8px",
                              fontSize: "14px",
                            }}
                          >
                            ✓ {
                              bookingFiles?.[`traveler_${index}_visa`]?.name
                            }
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.visa?.file
                        ?.message
                    }
                  </Error>
                </FormGroup>
              </>
            )}

            {/* Health Insurance */}

            {documentRules.healthInsurance && (
              <>
                <FormGroup>
                  <Label>Insurance Provider *</Label>

                  <Input
                    type="text"
                    {...register(
                      `travelers.${index}.travelDocuments.insurance.provider`,
                      {
                        required: "Insurance provider is required",
                      },
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.insurance
                        ?.provider?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Policy Number *</Label>

                  <Input
                    type="text"
                    {...register(
                      `travelers.${index}.travelDocuments.insurance.policyNumber`,
                      {
                        required: "Policy number is required",
                      },
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.insurance
                        ?.policyNumber?.message
                    }
                  </Error>
                </FormGroup>

                <FormGroup>
                  <Label>Insurance Document *</Label>

                  <Controller
                    control={control}
                    name={`travelers.${index}.travelDocuments.insurance.file`}
                    rules={{
                      required: "Insurance document is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />

                        {bookingFiles?.[`traveler_${index}_insurance`] && (
                          <p
                            style={{
                              color: "#22c55e",
                              marginTop: "8px",
                              fontSize: "14px",
                            }}
                          >
                            ✓{" "}
                            {
                              bookingFiles?.[`traveler_${index}_insurance`]?.name
                            }
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Error>
                    {
                      errors.travelers?.[index]?.travelDocuments?.insurance
                        ?.file?.message
                    }
                  </Error>
                </FormGroup>
              </>
            )}
          </FormGrid>

          <ButtonGroup>
            {fields.length > 1 && (
              <SecondaryButton
                type="button"
                onClick={() => removeTraveler(index)}
              >
                Remove Traveler
              </SecondaryButton>
            )}
          </ButtonGroup>
        </Section>
      ))}

      <BottomActions>
        <SecondaryButton type="button" onClick={addTraveler}>
          + Add Another Traveler
        </SecondaryButton>

        <PrimaryButton type="submit">Continue</PrimaryButton>
      </BottomActions>
    </form>
  );
};

export default PersonalInformation;
