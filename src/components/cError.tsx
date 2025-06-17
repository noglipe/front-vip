import { redirect, usePathname } from "next/navigation";

interface Props {
  msg: any;
}
export default function CError({ msg }: Props) {
  const pathname = usePathname();

  localStorage.setItem("RefreshLocal", pathname);
  localStorage.removeItem("data");

  redirect("/login");

  return <p className="text-center text-red-500">{msg}</p>;
}
