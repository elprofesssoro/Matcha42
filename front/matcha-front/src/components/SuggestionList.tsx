function SuggestionList({ suggestions, onSelect }: { suggestions: string[]; onSelect: (suggestion: string) => void }) {
    return (
        <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => onSelect(suggestion)}>
                    {suggestion}
                </li>
            ))}
        </ul>
    );
}

export default SuggestionList;