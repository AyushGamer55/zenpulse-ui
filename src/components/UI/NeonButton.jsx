export default function NeonButton({ children, onClick, color = "cyan" }) {
  const colors = {
    cyan: "bg-cyan-500 hover:bg-cyan-400 text-black",
    pink: "bg-pink-500 hover:bg-pink-400 text-black",
    green: "bg-green-500 hover:bg-green-400 text-black",
    yellow: "bg-yellow-500 hover:bg-yellow-400 text-black",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-bold shadow-md transition animate-glow ${colors[color]}`}
    >
      {children}
    </button>
  );
}
 
