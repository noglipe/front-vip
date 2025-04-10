import { Button } from "@/components/UI/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface BtnEditarProps {
  receita: boolean;
  id: string;
}

const BtnEditar: React.FC<BtnEditarProps> = ({ receita, id }) => {
  const router = useRouter();

  const link = receita ? "receita" : "despesa";

  return (
    <Button
      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-sm cursor-pointer hover:bg-yellow-500"
      onClick={() => router.push(`/app/transacoes/${link}/${id}`)}
    >
      <Edit className="mr-2" size={16} /> Editar
    </Button>
  );
};

export default BtnEditar;
