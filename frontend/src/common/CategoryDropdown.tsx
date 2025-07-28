import React from "react";
import { ChevronDown } from "lucide-react";

interface CategoryDropdownProps {
  type: "expense" | "income";
  value: string;
  customValue: string;
  setValue: (val: string) => void;
  setCustomValue: (val: string) => void;
  error?: string;
  dropdownOpen: boolean;
  setDropdownOpen: (val: boolean) => void;
}

const staticCategories = [
  "Food",
  "Transport",
  "Rent",
  "Entertainment",
  "Other (Add your own)",
];
const staticIncomeSources = [
  "Salary",
  "Freelance",
  "Investments",
  "Other (Add your own)",
];

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  type,
  value,
  customValue,
  setValue,
  setCustomValue,
  error,
  dropdownOpen,
  setDropdownOpen,
}) => {
  const label = type === "expense" ? "Expense Category" : "Income Source";
  const options = type === "expense" ? staticCategories : staticIncomeSources;

  return (
    <div className="relative">
      <label className="block font-medium mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`w-full bg-white border cursor-pointer ${
          error ? "border-red-500" : "border-gray-300"
        } text-gray-700 font-medium rounded-lg text-sm px-4 py-2.5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {value === "custom"
          ? customValue || "Enter custom"
          : value || `Select ${label}`}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {dropdownOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
          <ul className="py-2 text-sm text-gray-700">
            {options.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(cat === "Other (Add your own)" ? "custom" : cat);
                    if (cat !== "Other (Add your own)") setCustomValue("");
                    setDropdownOpen(false);
                  }}
                  className=" cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {value === "custom" && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder={`Enter custom ${label.toLowerCase()}`}
          className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default CategoryDropdown;
