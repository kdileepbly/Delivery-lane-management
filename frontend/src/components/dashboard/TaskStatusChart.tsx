import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartPoint = {
  status: string;
  total: number;
};

export function TaskStatusChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Throughput</p>
          <h3>Task distribution</h3>
        </div>
      </div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="status" stroke="#99a3b3" />
            <YAxis stroke="#99a3b3" />
            <Tooltip />
            <Bar dataKey="total" fill="#f97316" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
