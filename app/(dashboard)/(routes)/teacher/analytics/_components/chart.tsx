"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";

import { Card } from "@/components/ui/card";

interface ChartProps {
    data: {
        name: string,
        total: number;
    }[];
}

const Chart = ({ data }: ChartProps) => {
    return (
        <Card className="p-10">
            <ResponsiveContainer
              width="100%"
              height={350}
            >
                <BarChart data={data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={((value) => `N${value}`)}
                    />
                    <Bar
                      dataKey="total"
                      fill="#2814f7"
                      radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
 
export default Chart;