export default function Spinner({ minScreen }: { minScreen?: boolean }) {
  return (
    <div className={`w-full ${minScreen ? 'h-fit' : 'h-screen'} flex justify-center items-center`}>
      <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}