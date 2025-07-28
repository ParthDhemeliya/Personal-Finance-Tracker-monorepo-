import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgGradient: string;
  iconBg: string;
  loading?: boolean;
  percentChange?: number;
  percentLabel?: React.ReactNode;
  upColor?: string;
  downColor?: string;
  neutralColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgGradient,
  iconBg,
  loading = false,
  percentChange,
  percentLabel,
  upColor = "text-green-600",
  downColor = "text-red-600",
  neutralColor = "text-gray-500",
}) => {
  let percentClass = neutralColor;
  if (percentChange !== undefined) {
    if (percentChange > 0) percentClass = upColor;
    else if (percentChange < 0) percentClass = downColor;
  }

  return (
    <div
      className={`${bgGradient} p-6 rounded-xl shadow border hover:shadow-lg transition cursor-pointer group`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <span className={`${iconBg} p-2 rounded-full`}>{icon}</span>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 tracking-tight text-center break-all w-full">
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          <span className="text-2xl sm:text-2xl font-extrabold text-gray-900 tracking-tight text-center break-all w-full">
            {value}
          </span>
        )}
      </div>
      {percentLabel !== undefined && (
        <p
          className={`text-sm flex items-center mt-1 justify-center ${percentClass}`}
        >
          {percentLabel}
        </p>
      )}
    </div>
  );
};

export default StatCard;
