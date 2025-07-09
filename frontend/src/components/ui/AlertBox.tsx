// components/ui/AlertBox.tsx
export default function AlertBox({ type = 'error', message }: { type?: 'error' | 'warning' | 'info'; message: string }) {
  const colors = {
    error: 'bg-red-100 text-red-700 border-red-400',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    info: 'bg-blue-100 text-blue-700 border-blue-400',
  };
  return (
    <div className={`border-l-4 p-4 rounded ${colors[type]}`}>
      {message}
    </div>
  );
}
