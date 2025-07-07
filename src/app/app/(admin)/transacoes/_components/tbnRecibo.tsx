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
      className="flex flex-row justify-center items-center gap-0  py-2 bg-gray-700 text-white rounded-sm cursor-pointer hover:bg-gray-500"
      href={`/app/transacoes/recibo/${id}`}
    >
      <Printer className="" size={16} />
    </Link>
  );
};

export default BtnRecibo;
