import {useState } from "react";
import InputField from "../components/InputField";
import DateInput from '../components/DateInput';
import LocationPicker from "../components/LocationPicker";
import type { UserLocation } from "./RegisterPage";

type FormData = {
    name: string;
    birthday: string;
    location: UserLocation;
};

interface RegisterStep2Props {
    updateFormData: (fieldName: keyof FormData, value: FormData[keyof FormData]) => void;
    formData: FormData;
    nextStep: () => void;
    previousStep: () => void;
}

type FormErrors = {
    nameError?: string;
    birthdayError?: string;
    locationError?: string;
};

function checkInput(formData: FormData): FormErrors {
    const errors: FormErrors = {};
    
    if (!formData.name || !formData.name.trim()) {
        errors.nameError = "Name is required.";
    }

    if (!formData.birthday || formData.birthday.split('-').length < 2) {
        errors.birthdayError = "Birthday is required.";
    }

    if (!formData.location || !formData.location.displayString.trim()) {
        errors.locationError = "Location is required.";
    }

    return errors;
}

function RegisterStep2({ updateFormData, formData, nextStep, previousStep }: RegisterStep2Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const errors = checkInput(formData);

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
                currentMonth={formData.birthday ? formData.birthday.split('-')[1] : ''}
                currentYear={formData.birthday ? formData.birthday.split('-')[0] : ''}
                updateDate={(value) => updateFormData("birthday", value)}
                errorMessage={isSubmitted ? errors.birthdayError : undefined}
            />
            <LocationPicker
                updateFormData={(locationData) => {
                    updateFormData("location", {
                        displayString: locationData.displayString,
                        latitude: locationData.latitude,
                        longitude: locationData.longitude
                    });
                }}
                formData={formData.location}
                errorMessage={isSubmitted ? errors.locationError : undefined}
            />

            <section className="navigation-buttons">
                <button className="previous-button" type="button" onClick={previousStep}>
                    Previous
                </button>
                <button className="next-button" type="button" onClick={() => {
                    if (Object.keys(errors).length === 0) {
                        console.log("Next Step: Form Data:", formData);
                        nextStep();
                    } else {
                        console.log("Form Data:", formData);
                        setIsSubmitted(true);
                    }
                }}>
                    Next
                </button>
            </section>
        </section>
    );
}

export default RegisterStep2;