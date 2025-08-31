"use client";

type OptionButtonProps = {
  type: "checkbox" | "radio";
  label: string;
  checked?: boolean;
  loading?: boolean;
  value: string;
  name?: string; // required for radios
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

function OptionButton({
  type,
  label,
  value,
  loading,
  checked,
  name,
  onChange,
}: OptionButtonProps) {
  const baseClasses =
    "border-2 rounded-full p-2 m-2 font-medium hover:cursor-pointer transition duration-200";

  const checkedClasses =
    "border-red-500 bg-red-200 text-red-600";
  const uncheckedClasses =
    "border-gray-400 bg-gray-200 text-gray-700";

  if (type === "checkbox")
    return (
      <label
        className={`${baseClasses} ${
          checked ? checkedClasses : uncheckedClasses
        }
        ${loading && 'px-6'}`}
        htmlFor={value}
      >
        {label}
        <input
          onChange={onChange}
          value={value}
          id={value}
          checked={checked}
          className="hidden"
          type="checkbox"
        />
      </label>
    );

  if (type === "radio")
    return (
      <label
        className={`${baseClasses} ${
          checked ? checkedClasses : uncheckedClasses
        }`}
        htmlFor={value}
      >
        {label}
        <input
          onChange={onChange}
          value={value}
          id={value}
          name={name}
          checked={checked}
          className="hidden"
          type="radio"
        />
      </label>
    );

  return null;
}

export default OptionButton;
