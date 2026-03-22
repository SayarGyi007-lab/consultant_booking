import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
}

const FeatureCard = ({ icon: Icon, title, description, to }: Props) => {
  const content = (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-8 rounded-2xl border bg-gray-50 cursor-pointer"
    >
      <Icon className="mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

export default FeatureCard