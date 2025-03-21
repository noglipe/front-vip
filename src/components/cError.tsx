
interface Props {
  msg: any;
}
export default function CError({ msg }: Props) {
  return <p className="text-center text-red-500">{msg}</p>;
}
