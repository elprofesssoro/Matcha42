import './dateInput.css'

interface DateInputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    currentMonth: string;
    currentYear: string;
    updateDate: (value: string) => void;
    errorMessage?: string;
}

function DateInput({ name, label, type, placeholder, currentMonth,
    currentYear, updateDate, errorMessage }: DateInputProps) {

    return (
        <div className="input-field">
            <label htmlFor={name}>Birthday</label>
            <div className={`select-row ${errorMessage ? "error" : ""}`}>
                <select
                    value={currentMonth}
                    onChange={(e) => {
                        const newMonth = e.target.value;
                        const year = currentYear || "2000";
                        updateDate(`${year}-${newMonth}`);
                    }}
                >
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                <select
                    value={currentYear}
                    onChange={(e) => {
                        const newYear = e.target.value;
                        const month = currentMonth || "01";
                        updateDate(`${newYear}-${month}`);
                        console.log(`DATE: ${new Date().getFullYear()}`);
                    }}
                >
                    <option value="">Year</option>
                    {Array.from({ length: new Date().getFullYear() - 18 - 1950 + 1 }, (_, i) => new Date().getFullYear() - 18 - i).map((year) => (
                        <option key={year} value={year.toString()}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {errorMessage && <span className="error-message">{errorMessage}</span>}
        </div>
    );
}

export default DateInput;