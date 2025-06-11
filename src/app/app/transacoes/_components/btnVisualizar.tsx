import { Button } from "@/components/UI/button";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BtnProps {
  id: string;
}

const BtnVisualizar: React.FC<BtnProps> = ({ id }) => {
  const router = useRouter();

  return (
    <Button
      className="flex flex-col items-center gap-0 px-4 py-2 bg-blue-900 text-white rounded-sm cursor-pointer hover:bg-blue-500"
      onClick={() => router.push(`/app/transacoes/${id}`)}
    >
      <EyeIcon className="" size={16} />
    </Button>
  );
};

export default BtnVisualizar;
