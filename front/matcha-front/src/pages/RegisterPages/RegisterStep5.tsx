import { useEffect, useState } from "react";
import UserCard from "../../components/UserCard";
import type { DataForm } from "./RegisterPage";

interface RegisterStep5Props {
    dataForm: DataForm;
    previousStep: () => void;
    register: () => void;
}

function calculateAge(birthdayString: string | Date): number {
    const today = new Date();
    const birthDate = new Date(birthdayString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function RegisterStep5({ dataForm, previousStep, register }: RegisterStep5Props) {
    const userAge = dataForm.birthday ? calculateAge(dataForm.birthday) : undefined;
    // const errors = checkInput(formData);

    return (
        <section className="register-step4">
            <h2>Confirm your profile</h2>
            <UserCard
                name={dataForm.name}
                location={dataForm.location.displayString}
                bio={dataForm.bio}
                age={userAge?.toString()}
                tags={dataForm.interests}
                images={dataForm.images} />

            <section className="navigation-buttons">
                <button className="previous-button" type="button" onClick={previousStep}>
                    Previous
                </button>
                <button className="register-button" type="button" onClick={register}>
                    Register
                </button>
            </section>
        </section>
    );
}

export default RegisterStep5;