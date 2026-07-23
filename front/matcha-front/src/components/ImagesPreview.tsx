import './imagesPreview.css';

interface ImagesPreviewProps {
    images: (File | null)[];
    updateImage: (index: number, file: File | null) => void;
    mainImageIndex: number;
}

function ImagesPreview({ images, updateImage, mainImageIndex }: ImagesPreviewProps) {
    return (
        <div className="preview-carousel">
            {images.map((image, index) => {
                const url = image ? URL.createObjectURL(image) : null;
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
        </div>
    );
}

export default ImagesPreview;