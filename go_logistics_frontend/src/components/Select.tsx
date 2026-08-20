interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Select({
  label,
  name,
  options,
  required = false,
  value,
  onChange,
}: SelectProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-blue-600">*</span>
        )}
      </label>

      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select an option</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}