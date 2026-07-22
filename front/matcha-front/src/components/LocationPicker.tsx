import { useState } from "react";
import InputField from "./InputField";
import './locationPicker.css';
import type { UserLocation } from "../pages/RegisterPages/RegisterPage";

type Suggestion = {
    name: string;
    city?: string;
    country: string;
    lat: number;
    lng: number;
};

interface LocationPickerProps {
    updateFormData: (locationData: UserLocation) => void;
    formData: UserLocation;
    errorMessage?: string;
}

async function fetchCitySuggestions(searchQuery: string): Promise<Suggestion[]> {
    if (searchQuery.length < 3) return [];

    try {
        const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5&lang=de`
        );
        const data = await response.json();

        return data.features.map((feature: any) => ({
            name: feature.properties.name,
            city: feature.properties.city,
            country: feature.properties.country,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
        }));
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
    }
}

async function fetchCityByCoords(lat: number, lng: number): Promise<string> {
    try {
        const response = await fetch(
            `https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}&lang=de`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const properties = data.features[0].properties;
            const name = properties.name;
            const city = properties.city;
            const country = properties.country || "";

            if (!city || name === city) {
                return `${name}, ${country}`;
            }
            return `${city}, ${country}`;
        }

        return "";
    } catch (error) {
        console.error("Error during reverse geocoding:", error);
        return "";
    }
}

function formatCityCountry(suggestion: Suggestion): string {
    if (!suggestion.city || suggestion.name === suggestion.city) {
        return `${suggestion.name}, ${suggestion.country}`;
    }

    return `${suggestion.name}, ${suggestion.city}, ${suggestion.country}`;
}

function requestLocation(
    onSuccess: (coords: UserLocation) => void,
    onError: (message: string) => void
): void {
    if (!navigator.geolocation) {
        onError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const displayString = await fetchCityByCoords(position.coords.latitude, position.coords.longitude);
        onSuccess({
            displayString,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    }, (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                onError("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                onError("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                onError("The request to get user location timed out.");
                break;
            default:
                onError("An unknown error occurred.");
                break;
        }
    },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

export function LocationPicker({ updateFormData, formData, errorMessage }: LocationPickerProps) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateFormData({ displayString: value, latitude: 0, longitude: 0 });
        const results = await fetchCitySuggestions(value);
        setSuggestions(results);
    };

    const handleShareLocation = () => {
        setLoading(true);
        setError(null);

        requestLocation(
            (coords) => {
                setLoading(false);
                console.log("Location found:", coords);
                updateFormData(coords);
            },
            (errorMessage) => {
                setLoading(false);
                setError(errorMessage);
            }
        );
    };

    const handleSelectCity = (city: Suggestion) => {
        setSuggestions([]);
        const selectedLocation: UserLocation = {
            displayString: formatCityCountry(city),
            latitude: city.lat,
            longitude: city.lng,
        };
        updateFormData(selectedLocation);
    };

    return (
        <div className="location-container">
            <InputField
                name="location"
                label="Location"
                type="text"
                placeholder="e.g., Berlin, Germany"
                value={formData.displayString}
                onChange={handleInputChange}
                errorMessage={errorMessage}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((city, index) => (
                        <li key={index} onClick={() => handleSelectCity(city)}>
                            {formatCityCountry(city)}
                        </li>
                    ))}
                </ul>
            )}
            <p className="or"> or </p>
            <button
                type="button"
                className="location-button"
                onClick={handleShareLocation}
                disabled={loading}
            >
                {loading ? "Locating..." : "Share My Location"}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default LocationPicker;