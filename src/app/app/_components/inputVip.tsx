import "./Input.css";

interface InputProps {
  placeholder?: string;
  value: string;
  className?: string;
  setValue: (novoValor: string) => void;
}

const InputVip = ({ placeholder, value, className, setValue }: InputProps) => {
  const classN = `input-custom ${className}`.trim();
  return (
    <input
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value.toUpperCase())}
      className={classN}
    />
  );
};

export default InputVip;
