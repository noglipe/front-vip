import { Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BtnReciboProps {
  id: string| number;
}

export const BtnRecibo: React.FC<BtnReciboProps> = ({ id }) => {
  const router = useRouter();

  return (
    <Link
      className="flex flex-row justify-center items-center gap-0  py-2 bg-gray-700 text-white rounded-sm cursor-pointer hover:bg-gray-500"
      href={`/app/transacoes/recibo/${id}`}
    >
      <Printer className="" size={16} />
    </Link>
  );
};

export const LinkRecibo = ({ id }: BtnReciboProps) => {
  const router = useRouter();
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`/app/transacoes/${id}`}
      className="flex flex-row gap-2 items-center"
    >
      <Printer className="" size={16} />
      Recibo
    </Link>
  );
};
