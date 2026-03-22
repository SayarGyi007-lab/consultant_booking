import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

const StepItem = ({ icon: Icon, title, description }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <Icon className="text-gray-700" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default StepItem