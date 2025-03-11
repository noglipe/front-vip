export default function Menu() {
  return (
    <div className="flex flex-row items-center justify-around p-4 bg-black border-gray-500 border-b">
      <img src="/logos/brancaFVP.png" className="w-32" />
      <ul className="flex flex-row gap-4">
        <li>Sobre</li>
        <li>Login</li>
      </ul>
    </div>
  );
}
