import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  EMOTION_KEYS,
  EMOTION_LABELS,
  type EmotionAreaPoint,
} from "@/types/emotions";

export const description = "A stacked expanded area chart for emotions";

const chartConfig = EMOTION_KEYS.reduce<ChartConfig>((config, key, index) => {
  config[key] = {
    label: EMOTION_LABELS[key],
    color: `var(--chart-${index + 1})`,
  };
  return config;
}, {});

interface EmotionAreaChartProps {
  chartData: EmotionAreaPoint[];
}

const opacityForIndex = (index: number) => Math.max(0.18, 0.55 - index * 0.05);

const formatTimestamp = (value?: number) => {
  if (!value && value !== 0) {
    return "";
  }

  const milliseconds = value > 10_000 ? value : value * 1000;
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatStackValue = (rawValue: number) => {
  if (!Number.isFinite(rawValue)) {
    return "0";
  }

  if (rawValue <= 1) {
    return `${(rawValue * 100).toFixed(1)}%`;
  }

  return rawValue.toFixed(1);
};

const EmotionAreaChart: React.FC<EmotionAreaChartProps> = ({ chartData }) => {
  const hasData = chartData.length > 0;

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Emotion Area Chart</CardTitle>
          <CardDescription>Relative intensity for each emotion</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <AreaChart data={chartData} stackOffset="expand">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="frame"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                tickFormatter={(value) => `F${value}`}
              />
              <YAxis
                tickFormatter={(value) => formatStackValue(Number(value))}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(frame, payload) => {
                      const timestamp = payload?.[0]?.payload?.timestamp;
                      if (typeof timestamp === "number") {
                        return formatTimestamp(timestamp);
                      }

                      return `Frame ${frame}`;
                    }}
                    indicator="line"
                    formatter={(value) => formatStackValue(Number(value ?? 0))}
                  />
                }
              />
              {EMOTION_KEYS.map((emotionKey, index) => (
                <Area
                  key={emotionKey}
                  dataKey={emotionKey}
                  type="monotone"
                  stackId="emotions"
                  stroke={`var(--color-${emotionKey})`}
                  fill={`var(--color-${emotionKey})`}
                  fillOpacity={opacityForIndex(index)}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center text-sm text-muted-foreground">
            Upload a video to generate the area chart.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionAreaChart;
