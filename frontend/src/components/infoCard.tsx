import {type ReactNode } from "react";

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function InfoCard({ title, icon, children }: InfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h2>
      <div className="space-y-3 text-gray-900">{children}</div>
    </div>
  );
}
