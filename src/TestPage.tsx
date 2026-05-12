export default function TestPage() {
  return (
    <div className="h-screen-dynamic flex flex-col bg-red-200">
      <div className="h-16 bg-blue-200 flex items-center justify-center">
        <p className="text-blue-800 font-bold">Header</p>
      </div>
      <div className="flex-1 bg-green-200 overflow-auto flex items-center justify-center">
        <p className="text-green-800 font-bold">Content - Fills Space</p>
      </div>
      <div className="h-20 bg-yellow-200 flex items-center justify-center">
        <p className="text-yellow-800 font-bold">Footer / Nav</p>
      </div>
    </div>
  );
}
