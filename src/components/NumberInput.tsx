import { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number;
    onChange: (value: number) => void;
}

export default function NumberInput({ value, onChange, className = '', ...props }: NumberInputProps) {
    // Local processing of display value to handle "empty" or "initial 0" states nicely
    const [text, setText] = useState(value === 0 ? '' : String(value));

    // Sync from parent only if there's a semantic mismatch.
    // This allows local state to represent "0", "00", "" (empty), while parent sees 0 or value.
    useEffect(() => {
        // If the parsed local text doesn't match the new prop value, update local text.
        // This handles:
        // 1. External updates (e.g. calculation changes logic elsewhere) -> Syncs.
        // 2. Local typing "0", "", "00" -> Number(text) is 0. value is 0. No sync (keeps user input).
        // 3. Local typing "5" -> Number is 5. value is 5. No sync.
        if (Number(text) !== value) {
            // Special case: if value is 0, we generally want to show "0" IF the user didn't explicitly clear it?
            // But we can't distinguish "External Reset to 0" vs "User Typed 0".
            // However, the rule is: if semantically different, Overwrite.
            // If parent says 0, and we have "", Number("") is 0. 0===0. No overwrite. Stays empty. Good.
            // If parent says 5, we have "", Number("")=0 != 5. Overwrite to "5". Good.
            // If parent says 0, we have "5", different. Overwrite to "0". Good.

            // Should we display "0" or "" when value is 0?
            // Usually, standard inputs show "0".
            // If we have "" locally, we keep it.
            // If we have "5" and it becomes 0 externally, setText("0").
            setText(String(value));
        }
    }, [value, text]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setText(newVal);

        if (newVal === '') {
            onChange(0);
        } else {
            const num = Number(newVal);
            if (!isNaN(num)) {
                onChange(num);
            }
            // If NaN (e.g. "-"), we update text but don't call onChange with NaN?
            // Or call onChange(0)?
            // Better to ignoring onChange for partial inputs like "-" if we want strictly numbers, 
            // but standard HTML number inputs allow it.
            // Let's assume positive integers for this app mostly.
        }
    };

    return (
        <input
            type="number"
            value={text}
            onChange={handleChange}
            className={className}
            {...props}
        />
    );
}
