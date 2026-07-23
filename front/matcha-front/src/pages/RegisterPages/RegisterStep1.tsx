import { useState } from "react";
import InputField from "../../components/InputField";

export type Step1FormData = {
    username: string;
    email: string;
    password: string;
};

export type Step1FormErrors = {
    usernameError?: string;
    emailError?: string;
    passwordError?: string;
};

interface RegisterStep1Props {
    updateFormData: <K extends keyof Step1FormData>(
        fieldName: K,
        value: Step1FormData[K]
    ) => void;
    formData: Step1FormData;
    nextStep: () => void;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,12}$/;
const EMAIL_REGEX = /^[^\s@.]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function checkStep1Input(formData: Step1FormData): Step1FormErrors {
    const errors: Step1FormErrors = {};

    if (!formData.username.trim()) {
        errors.usernameError = "Username is required.";
    }
    else if (!USERNAME_REGEX.test(formData.username)) {
        errors.usernameError =
            "Username must be 3-12 characters long and can only contain letters, numbers, and underscores.";
    }

    if (!formData.email.trim()) {
        errors.emailError = "Email is required.";
    }
    else if (!EMAIL_REGEX.test(formData.email)) {
        errors.emailError = "Please enter a valid email address.";
    }

    if (!formData.password) {
        errors.passwordError = "Password is required.";
    }
    else if (!PASSWORD_REGEX.test(formData.password)) {
        errors.passwordError =
            "Password must be at least 8 characters long and contain at least one letter and one number.";
    }

    return errors;
}

function RegisterStep1({
    updateFormData,
    formData,
    nextStep,
}: RegisterStep1Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const currentErrors = checkStep1Input(formData);

    const handleNext = () => {
        setIsSubmitted(true);
        if (Object.keys(currentErrors).length === 0) {
            nextStep();
        }
    };

    return (
        <section className="register-step1">
            <h2>Create Account</h2>
            <p className="subtitle">Fill in your basic information to get started.</p>

            <InputField
                name="username"
                label="Username"
                type="text"
                placeholder="e.g., bobglasko"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                errorMessage={isSubmitted ? currentErrors.usernameError : undefined}
            />

            <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="e.g., bob@gmail.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                errorMessage={isSubmitted ? currentErrors.emailError : undefined}
            />

            <InputField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                errorMessage={isSubmitted ? currentErrors.passwordError : undefined}
            />

            <div className="navigation-buttons">
                <div className="show-password-container">
                    <input
                        type="checkbox"
                        id="show-password"
                        className="show-password"
                        checked={showPassword}
                        onChange={() => setShowPassword((prev) => !prev)}
                    />
                    <label htmlFor="show-password" className="show-password-label">
                        Show Password
                    </label>
                </div>

                <button className="next-button" type="button" onClick={handleNext}>
                    Next
                </button>
            </div>
        </section>
    );
}

export default RegisterStep1;