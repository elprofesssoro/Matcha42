import './inputField.css'

interface InputFieldProps {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
}
function InputField({ name, label, type, placeholder, value, onChange, errorMessage }: InputFieldProps) {
    return (
        <div className="input-field">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={errorMessage ? "error" : ""}
            />
            {errorMessage && <span className="error-message">{errorMessage}</span>}
        </div>
    );
}

export default InputField;