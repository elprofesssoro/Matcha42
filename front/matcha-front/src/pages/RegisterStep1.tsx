import InputField from "../components/InputField";
import { useEffect, useState } from "react";

interface RegisterStep1Props {
    updateFormData: (fieldName: string, value: string) => void;
    formData: FormData;
    nextStep: () => void;
}

// function checkInput(formData: { username: string; email: string; password: string },
//     setUsernameError: (error: string) => void,
//     setEmailError: (error: string) => void,
//     setPasswordError: (error: string) => void
// ) {
//     let isValid = true;
//     // return formData.username && formData.email && formData.password;
//     if (!formData.username) {
//         setUsernameError("Username is required.");
//         isValid = false;
//     } else {
//         setUsernameError("");
//     }

//     if (!formData.email) {
//         setEmailError("Email is required.");
//         isValid = false;
//     } else {
//         setEmailError("");
//     }

//     if (!formData.password) {
//         setPasswordError("Password is required.");
//         isValid = false;
//     } else {
//         setPasswordError("");
//     }

//     return isValid;
// }

type FormErrors = {
    usernameError?: string;
    emailError?: string;
    passwordError?: string;
};

type FormData = {
    username: string;
    email: string;
    password: string;
};

function checkInput(formData: FormData): FormErrors {
    const errors: FormErrors = {};
    if (!formData.username) {
        errors.usernameError = "Username is required.";
    }
    if (!formData.email) {
        errors.emailError = "Email is required.";
    }
    if (!formData.password) {
        errors.passwordError = "Password is required.";
    }
    return errors;
}


function RegisterStep1({ updateFormData, formData, nextStep }: RegisterStep1Props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const currentErrors = checkInput(formData);

    return (
        <section className="register-step1">
            <h2>Create Account</h2>
            <p className="subtitle">Fill in your basic information to get started.</p>
            <InputField
                name="username"
                label="Username"
                type="text"
                placeholder="e.g., maxmuster"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                errorMessage={isSubmitted ? currentErrors.usernameError : undefined}
            />
            <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="e.g.,  bob@gmail.com"
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

            <section className="navigation-buttons">
                <div className="show-password-container">
                    <input
                        type="checkbox"
                        className="show-password"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="show-password" className="show-password-label">Show Password</label>
                </div>
                <button className="next-button" type="button" onClick={() => {
                    if (Object.keys(currentErrors).length === 0) {
                        nextStep();
                    } else {
                        setIsSubmitted(true);
                    }
                }}>
                    Next
                </button>
            </section>
        </section>
    );
}

export default RegisterStep1;