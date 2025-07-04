import { Button } from "@/components/UI/button";
import { Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BtnReciboProps {
  id: string;
}

const BtnRecibo: React.FC<BtnReciboProps> = ({ id }) => {
  const router = useRouter();

  return (
    <Link
      className="flex flex-row items-center gap-0  py-4 bg-gray-700 text-white rounded-sm cursor-pointer hover:bg-gray-500"
      href={`/app/transacoes/recibo/${id}`}
    >
      <a>
        <Printer className="" size={16} />
      </a>
    </Link>
  );
};

export default BtnRecibo;
