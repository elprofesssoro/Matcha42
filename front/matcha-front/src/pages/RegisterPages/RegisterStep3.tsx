import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import SuggestionList from "../../components/SuggestionList";
import './registerPage3.css';

const maxInterestLength = 9;

type DataFrom = {
    bio: string;
    interests: string[];
};

interface RegisterStep3Props {
    updateFormData: (fieldName: keyof DataFrom, value: DataFrom[keyof DataFrom]) => void;
    formData: DataFrom;
    nextStep: () => void;
    previousStep: () => void;
}

type FormErrors = {
    interestsError?: string;
    bioError?: string;
};

function checkInput(formData: DataFrom): FormErrors {
    const errors: FormErrors = {};
    if (!formData.interests || formData.interests.length === 0) {
        errors.interestsError = "At least one interest is required.";
    }
    else if (formData.interests.length >= maxInterestLength) {
        errors.interestsError = "Too many interests selected.";
    }
    if (!formData.bio.trim()) {
        errors.bioError = "Bio is required.";
    }
    if (formData.bio.trim().length < 10 || formData.bio.trim().length > 50) {
        errors.bioError = "Bio must be between 10 and 50 characters long.";
    }

    return errors;
}

const interestsList: string[] = [
    "Travel",
    "Photography",
    "Cooking",
    "Sports",
    "Music",
    "Reading",
    "Gaming",
    "Fitness",
    "Art",
    "Technology"
];

function RegisterStep3({ updateFormData, formData, nextStep, previousStep }: RegisterStep3Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [interests, setInterests] = useState<string[]>(formData.interests || []);
    const errors = checkInput(formData);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [interestError, setInterestError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const filteredSuggestions = interestsList.filter(interest =>
                interest.toLowerCase().includes(value.toLowerCase())
            );
            filteredSuggestions.sort((a, b) => a.toLowerCase().indexOf(value.toLowerCase()) - b.toLowerCase().indexOf(value.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const addInterest = (interest: string) => {
        const updatedInterests = [...formData.interests, interest];
        if (updatedInterests.length > maxInterestLength) {
            return;
        }
        if (updatedInterests.length === maxInterestLength) {
            setInterestError("Too many interests selected.")
            console.log("Max interests");
        }
        else {
            setInterestError("");

        }

        setInterests(updatedInterests);
        updateFormData("interests", updatedInterests);
        interestsList.splice(interestsList.indexOf(interest), 1);
    }
    const handleSelectInterest = (interest: string) => {
        if (!interests.includes(interest)) {
            addInterest(interest);
        }
        setInputValue("");
        setSuggestions([]);
    };

    const handleRemoveInterest = (interest: string) => {
        const updatedInterests = interests.filter(i => i !== interest);
        setInterests(updatedInterests);
        setInterestError("");
        updateFormData("interests", updatedInterests);
        if (!interestsList.includes(interest)) {
            interestsList.push(interest);
        }
    };

    return (
        <section className="register-step3">
            <h2>Your Interests</h2>
            <p className="subtitle">Tell us about your interests.</p>
            <InputField
                name="bio"
                label="Bio"
                type="text"
                placeholder="Show us who you are..."
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                errorMessage={isSubmitted ? errors.bioError : undefined}
            />
            <div className="location-container">
                <InputField
                    name="interests"
                    label="Interests"
                    type="text"
                    placeholder="e.g., Travel, Photography"
                    value={inputValue}
                    onChange={handleInputChange}
                    errorMessage={interestError}
                />
                {suggestions.length > 0 && (
                    <SuggestionList
                        suggestions={suggestions}
                        onSelect={handleSelectInterest}
                    />
                )}
                {formData.interests.length > 0 && (
                    <div className="selected-interests">
                        {formData.interests.map((interest, index) => (
                            <div key={index} className="interest-tag">
                                {interest}
                                <button type="button" onClick={() => handleRemoveInterest(interest)}>x</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <section className="navigation-buttons">
                <button className="previous-button" type="button" onClick={previousStep}>
                    Previous
                </button>
                <button className="next-button" type="button" onClick={() => {
                    console.log("Form Data:", formData);
                    if (Object.keys(errors).length === 0) {
                        nextStep();
                    } else {
                        if (interests.length === 0) {
                            setInterestError("At least one interest is required.")
                        }
                        setIsSubmitted(true);
                    }
                }}>
                    Next
                </button>
            </section>
        </section>
    );
}

export default RegisterStep3;