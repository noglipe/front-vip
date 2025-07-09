import Image from "next/image";

interface LogoMedidaProps {
    tamanho: number;
}

export function LogoMedida({ tamanho }: LogoMedidaProps) {
    return (
        <div className="text-center flex flex-col items-cente">
            <Image
                src="/logos/logo25.png"
                alt="Logo"
                width={tamanho}
                height={tamanho}
                priority
            />
        </div>
    );
}

export function Logo64() {
    return (
        <div className="w-28 text-center flex flex-col items-center">
            <Image
                src="/logos/logo25.png"
                alt="Logo"
                width={64}
                height={64}
            />
        </div>
    );
}


export function LogoResponsiva() {
    return (
        <div className="w-full h-auto">
            <Image
                src="/logos/logo25.png"
                alt="Logo"
                width={400}
                height={400}
            />
        </div>
    );
}
