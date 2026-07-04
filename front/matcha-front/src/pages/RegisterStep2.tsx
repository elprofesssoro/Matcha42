import { useState } from "react";
import InputField from "../components/InputField";
import DateInput from '../components/DateInput';
import LocationPicker from "../components/LocationPicker";
import LocationData from "../components/LocationPicker";

interface RegisterStep2Props {
    updateFormData: (fieldName: string, value: string) => void;
    formData: {
        name: string;
        birthday: string;
        location: string,
        locationLatitude: number,
        locationLongitude: number
    };
    nextStep: () => void;
    previousStep: () => void;
}

function checkInput(formData: { name: string; birthday: string; location: string }, setBirthdayError: (error: boolean) => void): boolean {
    if (!formData.birthday) {
        setBirthdayError(true);
        return false;
    }

    const birthday = new Date(formData.birthday);
    const today = new Date();
    const minimumBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (Number.isNaN(birthday.getTime()) || birthday > today || birthday > minimumBirthDate) {
        setBirthdayError(true);
        return false;
    }

    setBirthdayError(false);

    return !!(formData.name.trim() && formData.location.trim());
}

function RegisterStep2({ updateFormData, formData, nextStep, previousStep }: RegisterStep2Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [birthdayError, setBirthdayError] = useState(false);

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
                errorMessage={isSubmitted && !formData.name ? 'Name is required.' : undefined}
            />
            <DateInput
                name="birthday"
                label="Birthday"
                type="date"
                placeholder="Pick date"
                currentMonth={formData.birthday ? formData.birthday.split('-')[1] : ''}
                currentYear={formData.birthday ? formData.birthday.split('-')[0] : ''}
                updateDate={(value) => updateFormData("birthday", value)}
                errorMessage={isSubmitted && birthdayError ? 'Valid birthday is required (must be at least 18 years old).' : undefined}
            />
            <LocationPicker
                updateFormData={(locationData) => {
                    updateFormData("location", locationData.displayString);
                    updateFormData("locationLatitude", locationData.latitude.toString());
                    updateFormData("locationLongitude", locationData.longitude.toString());
                }}
                formData={formData}
                errorMessage={isSubmitted && !formData.location ? 'Location is required.' : undefined}
            />

            <section className="navigation-buttons">
                <button className="previous-button" type="button" onClick={previousStep}>
                    Previous
                </button>
                <button className="next-button" type="button" onClick={() => {
                    if (checkInput(formData, setBirthdayError)) {
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