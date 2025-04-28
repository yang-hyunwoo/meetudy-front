"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AttendanceDonutChartProps {
  rate: number; // 출석률 (예: 82)
}

export default function AttendanceDonutChart({
  rate,
}: AttendanceDonutChartProps) {
  const data = [
    { name: "출석", value: rate },
    { name: "결석", value: 100 - rate },
  ];

  const COLORS = ["#22c55e", "#e5e7eb"]; // 초록, 연회색

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="70%" // 도넛 두께
            outerRadius="100%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 도넛 중앙 텍스트 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {rate}%
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">출석률</div>
      </div>
    </div>
  );
}
