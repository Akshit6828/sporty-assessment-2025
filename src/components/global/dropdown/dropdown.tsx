import { useEffect, useMemo, useRef, useState } from "react";
import "./dropdown.scss";

interface DropdownOption {
  label: any;
  value: any;
}
interface DropdownProps {
  options: DropdownOption[];
  value: DropdownOption;
  onChange: (item: DropdownOption) => void;
  placeholder?: string;
  width?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
}: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const onDropdownSelected = (selected: DropdownOption) => {
    setIsDropdownOpen(!isDropdownOpen);
    onChange(selected);
    setDropdownValue(selected);
  };

  const filterDropdownOptions = (e: any) => {
    const searchText = e.target.value.toLowerCase();
    setDropdownValue({ label: searchText, value: searchText.toLowerCase() });
  };

  const dropdownOptions = useMemo(() => {
    if (dropdownValue.label) {
      return options.filter((item) =>
        item.label.toLowerCase().includes(dropdownValue.label.toLowerCase())
      );
    }

    return options;
  }, [dropdownValue]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <input
        type="text"
        width={"100%"}
        placeholder={placeholder}
        value={dropdownValue?.label || ""}
        className={`dropdown-input`}
        onChange={filterDropdownOptions}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      <span
        className={`dropdown-arrow ${
          isDropdownOpen ? "arrow-up" : "arrow-down"
        }`}
      >
        {`>`}
      </span>

      {isDropdownOpen && (
        <div className="options-wrapper">
          {dropdownOptions.map((item: DropdownOption) => {
            return (
              <div
                key={item?.value}
                className={`dropdown-item ${
                  item?.value === value?.value ? "active" : ""
                }`}
                onClick={() => onDropdownSelected(item)}
              >
                {item?.label || ""}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
