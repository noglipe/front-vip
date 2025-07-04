import { Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BtnEditarProps {
  receita: boolean;
  id: string;
}

export const BtnEditar: React.FC<BtnEditarProps> = ({ receita, id }) => {
  const router = useRouter();

  const link = receita ? "receita" : "despesa";

  return (
    <Link
      className="flex flex-row items-center gap-0 py-2 bg-yellow-700 text-white rounded-sm cursor-pointer hover:bg-yellow-500"
      href={`/app/transacoes/${link}/${id}`}
    >
      <Edit className="" size={16} />
    </Link>
  );
};

export const MiniBtnEditar: React.FC<BtnEditarProps> = ({ receita, id }) => {
  const router = useRouter();

  const link = receita ? "receita" : "despesa";

  return (
    <Link
      className="flex text-center bg-transparent text-yellow-600 rounded-full cursor-pointer hover:bg-gray-300"
      href={`/app/transacoes/${link}/${id}`}
    >
      <Edit className="" size={14} />
    </Link>
  );
};
