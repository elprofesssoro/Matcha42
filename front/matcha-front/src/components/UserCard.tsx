import { useEffect, useState, useRef } from "react";
import './userCard.css';

type UserCardProps = {
    name?: string;
    age?: string;
    location?: string;
    bio?: string;
    tags?: string[];
    images: (File | null)[];
    height?: string;
    width?: string;
}

type CachedImage = {
    url: string;
    id: string;
};

function UserCard({ name, age, location, bio, tags = [], images, height, width }: UserCardProps) {
    const [imageData, setImageData] = useState<CachedImage[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const cacheRef = useRef<Map<File, CachedImage>>(new Map());

    useEffect(() => {
        const oldCache = cacheRef.current;
        const newCache = new Map<File, CachedImage>();
        const nextImageData: CachedImage[] = [];

        images.forEach((file) => {
            if (file === null) return;

            if (oldCache.has(file)) {
                const cached = oldCache.get(file)!;
                newCache.set(file, cached);
                oldCache.delete(file);
                nextImageData.push(cached);
            } else {
                const url = URL.createObjectURL(file);
                const cached = {
                    url,
                    id: `img-${Math.random().toString(36).substring(2, 11)}`
                };
                newCache.set(file, cached);
                nextImageData.push(cached);
            }
        });

        oldCache.forEach((cached) => {
            setTimeout(() => {
                URL.revokeObjectURL(cached.url);
            }, 1000);
        });

        cacheRef.current = newCache;
        setImageData(nextImageData);
    }, [images]);

    useEffect(() => {
        return () => {
            cacheRef.current.forEach((cached) => URL.revokeObjectURL(cached.url));
            cacheRef.current.clear();
        };
    }, []);

    useEffect(() => {
        if (currentImageIndex >= imageData.length) {
            setCurrentImageIndex(Math.max(0, imageData.length - 1));
        }
    }, [images, currentImageIndex]);

    const showNextImage = () => {
        if (currentImageIndex + 1 < imageData.length) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const showPrevImage = () => {
        if (currentImageIndex - 1 >= 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    const cardStyle = {
        ...(height && { height }),
        ...(width && { width })
    };

    return (
        <div className="user-card" style={Object.keys(cardStyle).length > 0 ? cardStyle : undefined}>
            <section className="info" >
                {name && age && (
                    <span className="name">{name}, {age}</span>
                )}
                {location && (
                    <span className="location">{location}</span>
                )}
                {bio && (
                    <span className="bio">{bio}</span>
                )}
                {tags && tags.length > 0 && (
                    <div
                        className={`tags-wrapper ${isExpanded ? "expanded" : ""}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{ cursor: "pointer" }}
                        role="button"
                        aria-expanded={isExpanded}
                    >
                        <div className="tags">
                            {tags.map((tag, index) => (
                                <span key={`card-tag-${index}`} className="tag real-tag">
                                    {tag}
                                </span>
                            ))}
                            <span className="tag more-dots-badge">...</span>
                        </div>
                    </div>
                )}
            </section>
            <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
                {imageData.map((img, index) => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt={`Preview ${index}`}
                        className="img-card"
                        style={{ translate: `${-100 * currentImageIndex}%` }}
                    />
                ))}
            </div>

            {
                currentImageIndex + 1 < imageData.length && (
                    <button onClick={showNextImage} className="img-slider-btn" style={{ right: 0 }}>
                        <p> ›</p>
                    </button>
                )
            }
            {
                currentImageIndex > 0 && (
                    <button onClick={showPrevImage} className="img-slider-btn" style={{ left: 0 }}>
                        <p> ‹</p>
                    </button>
                )
            }
        </div >
    );
}

export default UserCard;