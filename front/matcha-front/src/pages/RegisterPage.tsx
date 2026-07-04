import InputField from '../components/InputField';
import { useState } from 'react';
import './registerPage.css';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';

interface DataForm {
    username: string;
    email: string;
    password: string;
    name: string;
    bio: string;
    interests: string[];
    birthday: string;
    location: string;
    locationLatitude: number;
    locationLongitude: number;

}

type Location = {
    displayString: string;
    latitude: number;
    longitude: number;
};

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<DataForm>({
        username: '',
        email: '',
        password: '',
        name: '',
        bio: '',
        interests: [],
        birthday: '',
        location: '',
        locationLatitude: 0,
        locationLongitude: 0,
    });

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const updateFormData = (fieldName: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
    };

    return (
        <div className="register-page">
            <div className="register-card">
                {step === 1 && (
                    <RegisterStep1
                        updateFormData={updateFormData}
                        formData={formData}
                        nextStep={handleNextStep}
                    />
                )}
                {step === 2 && (
                    <RegisterStep2
                        updateFormData={updateFormData}
                        formData={formData}
                        nextStep={handleNextStep}
                        previousStep={handlePreviousStep}
                    />
                )}

                {/* <h1>Register</h1>
                <form>
                    <section className="social-login">
                        <button className="google-login">Register with Google</button>
                        <button className="facebook-login">Register with Facebook</button>
                    </section>
                    <p className='text-or'>Or</p>
                    <InputField
                        name="credentials"
                        label="Username or Email"
                        type="text"
                        placeholder="e.g., max@muster.de"
                    />

                    <InputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <button className="login-button" type="submit">Register</button>
                </form> */}
            </div>
        </div>
    );
}

export default RegisterPage;
