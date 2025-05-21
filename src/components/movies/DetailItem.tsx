interface DetailItemProps {
  label: string;
  value?: string | null;
}

export function DetailItem({ label, value }: DetailItemProps) {
  if (!value || value.trim() === "" || value === "N/A") {
    return null;
  }
  return (
    <div>
      <strong className="font-medium">{label}:</strong> {value}
    </div>
  );
}
