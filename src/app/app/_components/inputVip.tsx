import "./Input.css";

interface InputProps {
  nome: string;
  value: string;
  className?: string;
  setValue: (novoValor: string) => void;
}

const InputVip = ({ nome, value, className, setValue  }: InputProps) => {
  const classN = `input-custom ${className}`.trim();
  return (
    <input
      placeholder={nome}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value.toUpperCase())}
      className={classN}
    />
  );
};

export default InputVip;
