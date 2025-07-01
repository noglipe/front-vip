import { CircleCheckBig, CircleEllipsis } from "lucide-react";

interface IfConcluidoProps {
  concluido: boolean;
}

export function IfConcluidoText({ concluido = true }: IfConcluidoProps) {
  return (
    <div>
      <span className="text-lg font-semibold">
        Transação {concluido ? "Concluída" : "Pendente"}
      </span>
    </div>
  );
}

export function IfConcluidoCircle({ concluido = true }: IfConcluidoProps) {
  return (
    <div>
      {concluido ? (
        <CircleCheckBig className="text-green-600" />
      ) : (
        <CircleEllipsis className="text-gray-500" />
      )}
    </div>
  );
}

interface IfConcluidoProps {
  concluido: boolean;
}


