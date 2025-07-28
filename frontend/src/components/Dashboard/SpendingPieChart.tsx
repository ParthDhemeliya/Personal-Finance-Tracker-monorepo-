import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useTypedDispatch";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { fetchExpenseCategorySummaryThunk } from "../../redux/expense/expenseCategoryThunk";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E42",
  "#EF4444",
  "#A78BFA",
  "#F472B6",
];

const SpendingPieChart = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) => state.expenseCategory,
  );

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    dispatch(fetchExpenseCategorySummaryThunk(month));
  }, [dispatch, month]);

  const chartData = data.map((item, idx) => ({
    name: item.category,
    value: item.amount,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="space-y-4 animate-fade-in w-full flex flex-col items-center">
      <h3 className="text-lg font-bold text-yellow-700 mb-2 tracking-wide flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>{" "}
        Spending by Category
      </h3>
      {loading ? (
        <div className="text-gray-400 text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-full">
            <div
              style={{ width: "100%", height: 260 }}
              className="flex items-center justify-center transition-transform duration-200 hover:scale-105"
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent > 0.07
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                    isAnimationActive={true}
                    animationDuration={900}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  {/* Center label for total */}
                  <text
                    x={"50%"}
                    y={"50%"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold text-yellow-700"
                  >
                    ₹
                    {chartData
                      .reduce((sum, d) => sum + d.value, 0)
                      .toLocaleString()}
                  </text>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      background: "#fff",
                      border: "1px solid #facc15",
                      color: "#78350f",
                    }}
                    itemStyle={{ color: "#78350f" }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Modern Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 w-full">
              {chartData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 shadow-sm hover:bg-yellow-100 transition-colors duration-200"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-sm font-semibold text-yellow-800">
                    {entry.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    (₹{entry.value.toLocaleString()})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingPieChart;
