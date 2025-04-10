import { Button } from "@/components/UI/button";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";

interface BtnReciboProps {
  id: string;
}

const BtnRecibo: React.FC<BtnReciboProps> = ({ id }) => {
  const router = useRouter();

  return (
    <Button
      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-sm cursor-pointer hover:bg-gray-500"
      onClick={() => router.push(`/app/transacoes/recibo/${id}`)}
    >
      <Printer className="mr-2" size={16} /> Recibo
    </Button>
  );
};

export default BtnRecibo;
