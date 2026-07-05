import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import DateInput from '../components/DateInput';
import LocationPicker from "../components/LocationPicker";
import type { UserLocation } from "./RegisterPage";

type FormData = {
    name: string;
    birthday: string;
    location: UserLocation;
};

interface RegisterStep3Props {
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
    if (!formData.name) {
        errors.nameError = "Name is required.";
    }
    if (!formData.birthday) {
        errors.birthdayError = "Birthday is required.";
    }
    if (!formData.location || !formData.location.displayString && !formData.location.latitude && !formData.location.longitude) {
        errors.locationError = "Location is required.";
    }
    return errors;
}

function RegisterStep3({ updateFormData, formData, nextStep, previousStep }: RegisterStep3Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [birthdayError, setBirthdayError] = useState(false);

    useEffect(() => {
        if (formData.birthday) {
            const birthday = new Date(formData.birthday);
            const today = new Date();
            const minimumBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

            if (Number.isNaN(birthday.getTime()) || birthday > today || birthday > minimumBirthDate) {
                setBirthdayError(true);
            } else {
                setBirthdayError(false);
            }
        }
    }, [formData.birthday]);

    return (
        <section className="register-step2">
            <h2>Your Information</h2>
            <p className="subtitle">Tell us about yourself.</p>


            <section className="navigation-buttons">
                <button className="previous-button" type="button" onClick={previousStep}>
                    Previous
                </button>
                <button className="next-button" type="button" >
                    Next
                </button>
            </section>
        </section>
    );
}

export default RegisterStep3;