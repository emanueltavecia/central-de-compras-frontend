export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md animate-pulse space-y-4 px-4">
        <div className="mb-8 flex justify-center">
          <div className="bg-surface h-16 w-16 rounded-xl"></div>
        </div>
        <div className="bg-surface mx-auto h-8 w-3/4 rounded"></div>
        <div className="bg-surface mx-auto h-4 w-1/2 rounded"></div>
        <div className="space-y-4 pt-8">
          <div className="bg-surface h-12 rounded"></div>
          <div className="bg-surface h-12 rounded"></div>
          <div className="bg-surface h-10 rounded"></div>
        </div>
      </div>
    </div>
  )
}
