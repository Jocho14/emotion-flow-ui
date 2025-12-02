import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  EMOTION_KEYS,
  EMOTION_LABELS,
  type EmotionRadarPoint,
} from "@/types/emotions";

const chartConfig = EMOTION_KEYS.reduce<ChartConfig>(
  (config, key, index) => {
    config[key] = {
      label: EMOTION_LABELS[key],
      color: `var(--chart-${index + 1})`,
    };
    return config;
  },
  {
    magnitude: {
      label: "Magnitude",
      color: "var(--chart-9)",
    },
  }
);

const emotionColorMap = EMOTION_KEYS.reduce<Record<string, string>>(
  (accumulator, key) => {
    const colorToken = `var(--color-${key})`;
    const label = EMOTION_LABELS[key];

    accumulator[key] = colorToken;
    accumulator[label] = colorToken;
    accumulator[label.toLowerCase()] = colorToken;

    return accumulator;
  },
  {}
);

interface RadarDotProps {
  cx?: number;
  cy?: number;
  payload?: {
    emotion?: string;
  };
}

const CustomDot = ({ cx = 0, cy = 0, payload }: RadarDotProps) => {
  const emotionName = payload?.emotion as string;
  const color =
    emotionColorMap[emotionName?.toLowerCase()] || chartConfig.magnitude.color;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill={color}
      stroke="var(--background)"
      strokeWidth={2}
    />
  );
};

const CustomPolarAngleAxisTick = ({
  payload,
  x,
  y,
  cx,
}: {
  payload?: { value?: string };
  x?: number;
  y?: number;
  cx?: number;
}) => {
  const emotionName = payload?.value as string;
  const color =
    emotionColorMap[emotionName?.toLowerCase()] || "var(--foreground)";
  const xPosition = x ?? 0;
  const centerX = cx ?? 0;

  return (
    <g transform={`translate(${xPosition},${y ?? 0})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor={
          xPosition > centerX ? "start" : xPosition < centerX ? "end" : "middle"
        }
        fill={color}
        className="font-semibold text-sm"
      >
        {emotionName}
      </text>
    </g>
  );
};

type RadarChartInput =
  | EmotionRadarPoint[]
  | Record<string, number>
  | null
  | undefined;

interface EmotionRadarChartProps {
  chartData: RadarChartInput;
}

const EmotionRadarChart: React.FC<EmotionRadarChartProps> = ({ chartData }) => {
  const preparedData = React.useMemo<EmotionRadarPoint[]>(() => {
    if (Array.isArray(chartData)) {
      return chartData;
    }

    if (chartData && typeof chartData === "object") {
      return Object.entries(chartData).map(([emotion, magnitude]) => ({
        emotion,
        magnitude: Number(magnitude),
      }));
    }

    return [];
  }, [chartData]);

  const normalizedData = React.useMemo(() => {
    if (!preparedData.length) {
      return [];
    }

    const byEmotion = preparedData.reduce<Record<string, EmotionRadarPoint>>(
      (accumulator, point) => {
        const key = point.emotion.toLowerCase();
        accumulator[key] = point;
        return accumulator;
      },
      {}
    );

    return EMOTION_KEYS.map((emotionKey) => {
      const label = EMOTION_LABELS[emotionKey];
      const entry = byEmotion[emotionKey] || byEmotion[label.toLowerCase()];

      return {
        emotion: label,
        magnitude: entry?.magnitude ?? 0,
        fullMark: entry?.fullMark,
        emotionKey,
      };
    });
  }, [preparedData]);

  const hasData = normalizedData.some((point) => point.magnitude > 0);

  const maxMagnitude = normalizedData.reduce((max, point) => {
    return Math.max(max, point.magnitude ?? 0);
  }, 0);

  const maxFullMark = normalizedData.reduce((max, point) => {
    return Math.max(max, point.fullMark ?? 0);
  }, 0);

  const topEmotion = React.useMemo(() => {
    if (!normalizedData.length) {
      return null;
    }

    return normalizedData.reduce((best, current) =>
      current.magnitude > best.magnitude ? current : best
    );
  }, [normalizedData]);

  const domainMax = React.useMemo(() => {
    if (maxMagnitude <= 0) {
      return Math.max(maxFullMark, 1);
    }

    if (maxMagnitude <= 1) {
      return Math.max(maxFullMark, 1);
    }

    const roundingBase = maxMagnitude > 100 ? 50 : 10;
    const roundedMagnitude =
      Math.ceil(maxMagnitude / roundingBase) * roundingBase;
    return Math.max(roundedMagnitude, maxFullMark || 1);
  }, [maxFullMark, maxMagnitude]);

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Emotion Radar Chart</CardTitle>
        <CardDescription>
          Showing the relative magnitude of all emotions
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[500px]"
          >
            <RadarChart
              data={normalizedData}
              outerRadius="80%"
              margin={{ top: 32, right: 48, bottom: 32, left: 48 }}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value, payload) =>
                      payload?.[0]?.payload.emotion || value
                    }
                    formatter={(value) => [value, "Magnitude"]}
                  />
                }
              />
              <PolarAngleAxis
                dataKey="emotion"
                tick={CustomPolarAngleAxisTick}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, domainMax]}
                tick={false}
                axisLine={false}
              />
              <PolarGrid />
              <Radar
                dataKey="magnitude"
                name="Emotion Profile"
                stroke={chartConfig.magnitude.color}
                strokeWidth={2}
                fill={chartConfig.magnitude.color}
                fillOpacity={0.25}
                dot={CustomDot}
              />
            </RadarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            Upload a video to generate the radar chart.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {hasData && topEmotion
            ? `${topEmotion.emotion} is currently leading.`
            : "Waiting for an analysis."}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data based on aggregated sentiment analysis.
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmotionRadarChart;
