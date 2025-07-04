import { Button } from "@/components/UI/button";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BtnProps {
  id: string;
}

const BtnVisualizar: React.FC<BtnProps> = ({ id }) => {
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

export default BtnVisualizar;
