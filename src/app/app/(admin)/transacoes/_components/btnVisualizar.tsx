import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BtnProps {
  id: string | number;
}

export const BtnVisualizar = ({ id }: BtnProps) => {
  const router = useRouter();
  return (
    <Link
      href={`/app/transacoes/${id}`}
      className="flex flex-col items-center gap-0 px-4 py-2 bg-blue-900 text-white rounded-sm cursor-pointer hover:bg-blue-500"
    >
      <EyeIcon className="" size={16} />
    </Link>
  );
};

export const LinkVisualizar = ({ id }: BtnProps) => {
  const router = useRouter();
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`/app/transacoes/${id}`}
      className="flex flex-row gap-2 items-center"
    >
      <EyeIcon className="" size={16} />
      Visualizar
    </Link>
  );
};
