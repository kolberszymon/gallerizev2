export function Navbar() {
  return (
    <div className="w-full h-[60px] flex doodle-shadow bg-red-500 items-center justify-between px-20 text-white text-2xl border-b-black border-b-4">
      <p>Gallerize</p>
      <div className="flex gap-10">
        <button>Home</button>
        <button>Gallery</button>
        <button>About</button>
      </div>
    </div>
  );
}
