interface InfoRowProps {
  label: string;
  value: string | number;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <p className="flex justify-between">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className="font-semibold">{value}</span>
    </p>
  );
}
