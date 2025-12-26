interface SpinnerProps {
  size?: number;
  color?: string;
}

export function PageLoading() {
  return (
    <div className="flex justify-center mt-20">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ButtonLoading({
  size = 16,
}: SpinnerProps) {
  return (
    <div
      className="border-2 border-white border-t-transparent rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

