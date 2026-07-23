import { useEffect, useState } from "react";
import UserCard from "../../components/UserCard";
import "./registerPage4.css";
import ImagesPreview from "../../components/ImagesPreview";

export type Step4FormData = {
    bio?: string;
    interests?: string[];
    images: File[];
};

export type Step4FormErrors = {
    imagesError?: string;
};

interface RegisterStep4Props {
    updateFormData: <K extends keyof Step4FormData>(
        fieldName: K,
        value: Step4FormData[K]
    ) => void;
    formData: Step4FormData;
    nextStep: () => void;
    previousStep: () => void;
}

function validateStep4(images: (File | null)[]): Step4FormErrors {
    const errors: Step4FormErrors = {};
    const validImages = images.filter((img): img is File => img !== null);

    if (validImages.length === 0) {
        errors.imagesError = "At least one photo is required.";
    }

    return errors;
}

function RegisterStep4({
    updateFormData,
    formData,
    nextStep,
    previousStep,
}: RegisterStep4Props) {
    const [images, setImages] = useState<(File | null)[]>(() => {
        const initialSlots: (File | null)[] = Array(5).fill(null);
        formData.images?.forEach((img, index) => {
            if (index < 5) initialSlots[index] = img;
        });
        return initialSlots;
    });

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const urls = images.map((file) => (file ? URL.createObjectURL(file) : ""));
        setImageUrls(urls);

        return () => {
            urls.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [images]);

    const updateImage = (index: number, file: File | null) => {
        setImages((prev) => {
            const nextImages = [...prev];
            nextImages[index] = file;
            return nextImages;
        });
    };

    const validImages = images.filter((img): img is File => img !== null);
    const errors = validateStep4(images);
    const hasImages = validImages.length > 0;

    const handleNext = () => {
        setIsSubmitted(true);
        if (Object.keys(errors).length === 0) {
            updateFormData("images", validImages);
            nextStep();
        }
    };

    return (
        <section className="register-step4">
            <h2>Your Photos</h2>
            <p className="subtitle">Upload up to 5 photos to complete your profile.</p>

            <div className="image-section">
                {hasImages ? (
                    <UserCard images={validImages} width="300px" height="350px" />
                ) : (
                    <div className="empty-image-card">
                        <span>No photos uploaded yet</span>
                    </div>
                )}
            </div>

            <div className="controls">
                {/* <div className="preview-carousel">
                    {images.map((image, index) => {
                        const url = imageUrls[index];
                        const isMain = index === 0 && image !== null;

                        if (image && url) {
                            return (
                                <div
                                    key={`slot-${index}`}
                                    className={`preview-image ${isMain ? "is-main" : ""}`}
                                >
                                    <img src={url} alt={`Upload slot ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => updateImage(index, null)}
                                        aria-label={`Remove photo ${index + 1}`}
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
                                title={`Upload photo slot ${index + 1}`}
                            >
                                <span className="plus-icon">+</span>
                                <input
                                    id={`file-input-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden-input"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            updateImage(index, file);
                                        }
                                        e.target.value = "";
                                    }}
                                />
                            </label>
                        );
                    })}
                </div> */}
                <ImagesPreview images={images} updateImage={updateImage} mainImageIndex={0} />
            </div>

            {isSubmitted && errors.imagesError && (
                <span className="error-message">{errors.imagesError}</span>
            )}

            <div className="navigation-buttons">
                <button
                    className="previous-button"
                    type="button"
                    onClick={previousStep}
                >
                    Previous
                </button>
                <button className="next-button" type="button" onClick={handleNext}>
                    Next
                </button>
            </div>
        </section>
    );
}

export default RegisterStep4;