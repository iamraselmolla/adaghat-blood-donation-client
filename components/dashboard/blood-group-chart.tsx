"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "O+", value: 32, color: "#e11d48" },
  { name: "A+", value: 22, color: "#f43f5e" },
  { name: "B+", value: 18, color: "#fb7185" },
  { name: "AB+", value: 8, color: "#fda4af" },
  { name: "O-", value: 10, color: "#9f1239" },
  { name: "Other", value: 10, color: "#881337" },
];

export function BloodGroupChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Group Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--popover))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
