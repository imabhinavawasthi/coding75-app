"use client";

import ComingSoon from "./coming-soon";
import { Construction } from "lucide-react";

const UnderConstruction = () => {
  return (
    <ComingSoon
      title="Under Construction"
      subtitle="Exciting Content Coming Soon"
      description="Our team is in the process of crafting comprehensive, high-yield engineering resources for this module. Stay tuned for an exceptional learning experience."
      icon={Construction}
      badge="Under Construction"
      eta="In Development"
    />
  );
};

export default UnderConstruction;