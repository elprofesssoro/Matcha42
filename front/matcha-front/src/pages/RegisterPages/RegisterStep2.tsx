import { useState } from "react";
import InputField from "../../components/InputField";
import DateInput from "../../components/DateInput";
import LocationPicker from "../../components/LocationPicker";
import type { UserLocation } from "./RegisterPage";

export type Step2FormData = {
    name: string;
    birthday: string;
    location: UserLocation;
};

export type Step2FormErrors = {
    nameError?: string;
    birthdayError?: string;
    locationError?: string;
};

interface RegisterStep2Props {
    updateFormData: <K extends keyof Step2FormData>(
        fieldName: K,
        value: Step2FormData[K]
    ) => void;
    formData: Step2FormData;
    nextStep: () => void;
    previousStep: () => void;
}

function validateStep2(formData: Step2FormData): Step2FormErrors {
    const errors: Step2FormErrors = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
        errors.nameError = "Name is required.";
    } else if (trimmedName.length < 2 || trimmedName.length > 25) {
        errors.nameError = "Name must be between 2 and 25 characters long.";
    }

    if (!formData.birthday) {
        errors.birthdayError = "Birthday is required.";
    } else {
        const parts = formData.birthday.split("-");
        const year = parts[0];
        const month = parts[1];

        if (!year || year.length !== 4) {
            errors.birthdayError = "Please enter a valid 4-digit year.";
        } else if (!month || month.length !== 2) {
            errors.birthdayError = "Please enter a valid month.";
        } else {
            const birthYear = parseInt(year, 10);
            const birthMonth = parseInt(month, 10);
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1;

            if (
                birthYear > currentYear ||
                (birthYear === currentYear && birthMonth > currentMonth)
            ) {
                errors.birthdayError = "Birthday cannot be in the future.";
            }
        }
    }

    const displayLocation = formData.location?.displayString?.trim();
    if (!displayLocation) {
        errors.locationError = "Location is required.";
    } else if (
        formData.location.latitude === undefined ||
        formData.location.longitude === undefined ||
        formData.location.latitude === null ||
        formData.location.longitude === null
    ) {
        errors.locationError = "Please select a valid location.";
    }

    return errors;
}
function RegisterStep2({
    updateFormData,
    formData,
    nextStep,
    previousStep,
}: RegisterStep2Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const errors = validateStep2(formData);

    const handleNext = () => {
        setIsSubmitted(true);
        if (Object.keys(errors).length === 0) {
            nextStep();
        }
    };

    const dateParts = formData.birthday ? formData.birthday.split("-") : [];
    const currentYear = dateParts[0] || "";
    const currentMonth = dateParts[1] || "";

    return (
        <section className="register-step2">
            <h2>Your Information</h2>
            <p className="subtitle">Tell us about yourself.</p>

            <InputField
                name="name"
                label="Name"
                type="text"
                placeholder="e.g., Bob"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                errorMessage={isSubmitted ? errors.nameError : undefined}
            />

            <DateInput
                name="birthday"
                label="Birthday"
                type="date"
                placeholder="Pick date"
                currentMonth={currentMonth}
                currentYear={currentYear}
                updateDate={(value) => updateFormData("birthday", value)}
                errorMessage={isSubmitted ? errors.birthdayError : undefined}
            />

            <LocationPicker
                updateFormData={(locationData) => {
                    updateFormData("location", {
                        displayString: locationData.displayString,
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                    });
                }}
                formData={formData.location}
                errorMessage={isSubmitted ? errors.locationError : undefined}
            />

            <div className="navigation-buttons">
                <button
                    className="previous-button"
                    type="button"
                    onClick={previousStep}
                >
                    Previous
                </button>
                <button className="next-button" type="button" onClick={handleNext}>
                    Next
                </button>
            </div>
        </section>
    );
}

export default RegisterStep2;