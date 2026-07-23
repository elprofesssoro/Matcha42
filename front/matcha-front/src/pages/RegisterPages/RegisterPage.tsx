import { useState } from 'react';
import './registerPage.css';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import RegisterStep3 from './RegisterStep3';
import RegisterStep4 from './RegisterStep4';
import RegisterStep5 from './RegisterStep5'

export interface DataForm {
    username: string;
    email: string;
    password: string;
    name: string;
    bio: string;
    interests: string[];
    birthday: string;
    location: UserLocation;
    images: File[];
}

export type UserLocation = {
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
        location: {
            displayString: '',
            latitude: 0,
            longitude: 0
        },
        images: []
    });

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    function updateFormData<K extends keyof DataForm>(fieldName: K, value: DataForm[K]) {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }

    function registerUser() {

    }

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
                {step === 3 && (
                    <RegisterStep3
                        updateFormData={updateFormData}
                        formData={formData}
                        nextStep={handleNextStep}
                        previousStep={handlePreviousStep}
                    />
                )}
                {step === 4 && (
                    <RegisterStep4
                        updateFormData={updateFormData}
                        formData={formData}
                        nextStep={handleNextStep}
                        previousStep={handlePreviousStep}
                    />
                )}
                {step === 5 && (
                    <RegisterStep5
                        dataForm={formData}
                        previousStep={handlePreviousStep}
                        register={registerUser}
                    />
                )}

            </div>
        </div>
    );
}

export default RegisterPage;
