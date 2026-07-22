import { useEffect, useState } from "react";
import './registerPage4.css';
import UserCard from "../../components/UserCard";

type DataFrom = {
    bio: string;
    interests: string[];
    images: File[];
};

interface RegisterStep4Props {
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
    if (!formData.bio?.trim()) {
        errors.bioError = "Bio is required.";
    }
    return errors;
}

function RegisterStep4({ updateFormData, formData, nextStep, previousStep }: RegisterStep4Props) {
    const [images, setImages] = useState(() => {
        const initialImages = Array(5).fill(null);
        formData.images.forEach((img, index) => {
            if (index < 5) {
                initialImages[index] = img;
            }
        });
        return initialImages;
    });
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [imagesCount, setImagesCount] = useState(0);
    const errors = checkInput(formData);

    useEffect(() => {
        const urls = images.map(file => file ? URL.createObjectURL(file) : "");
        setImageUrls(urls);

        return () => {
            urls.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [images]);

    const updateImage = (index: number, file: File | null) => {
        setImagesCount(file === null ? imagesCount - 1 : imagesCount + 1)
        setErrorMessage("");
        setImages(prev => {
            const nextImages = [...prev];
            nextImages[index] = file;
            return nextImages;
        });
    };

    const handleNext = () => {
        if (Object.keys(errors).length !== 0) {
            console.warn("Validation errors:", errors);
            return;
        }
        console.log("Form valid, proceeding. Data:", formData);
        const imagesTemp = images.filter((img): img is File => img !== null);
        updateFormData("images", imagesTemp);
        nextStep();
    };

    const hasImages = images.some(img => img !== null);

    return (
        <section className="register-step4">
            <h2>Your Photos</h2>
            <p className="subtitle">Upload some photos to get started.</p>

            <section className="image-section">
                {hasImages ? (
                    <UserCard
                        images={images} 
                        width="300px"
                        height="350px"/>
                ) : (
                    <div className="empty-image-card" />
                )}
            </section>

            <section className="controls">
                <div className="preview-carousel">
                    {images.map((image, index) => {
                        const url = imageUrls[index];
                        if (image && url) {
                            return (
                                <div key={`slot-${index}`} className="preview-image">
                                    <img
                                        src={url}
                                        alt={`Upload ${index}`}
                                    />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => updateImage(index, null)}
                                        aria-label="Remove image"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <label
                                key={`slot-${index}`}
                                htmlFor={`file-input-${index}`}
                                className="empty-preview"
                            >
                                <span className="plus-icon">+</span>
                                <input
                                    id={`file-input-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden-input"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) updateImage(index, file);
                                    }}
                                />
                            </label>
                        );
                    })}
                </div>
            </section>
            {errorMessage && <span className="error-message">{errorMessage}</span>}


            <section className="navigation-buttons">
                <button className="previous-button" type="button" onClick={previousStep}>
                    Previous
                </button>
                <button className="next-button" type="button" onClick={() => {
                    // if (imagesCount === 0) {
                    //     setErrorMessage("No image was provided");
                    // }
                    // else {
                    //     handleNext();
                    // }
                    handleNext();

                }}>
                    Next
                </button>
            </section>
        </section>
    );
}

export default RegisterStep4;