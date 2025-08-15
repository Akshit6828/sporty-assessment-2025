import "./search.scss";

interface SearchProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  width?: string;
}

export default function Search({
  value,
  onChange,
  placeholder = "Search...",
  width = "100%",
}: SearchProps) {
  return (
    <input
      className="custom-search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      width={width}
    />
  );
}
