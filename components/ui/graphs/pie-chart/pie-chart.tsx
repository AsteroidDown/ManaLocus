import React, { useRef, useState } from "react";

export type PieChartSlice = {
  value: number;
  color: string;
  label?: string;
  onClick?: () => void;
};

export interface PieChartSeries {
  data: PieChartSlice[];
  innerRadius: number;
  outerRadius: number;
  gapWidth?: number;
}

interface PieChartProps {
  series: PieChartSeries[];
  size?: number;
}

export default function PieChart({ series, size = 200 }: PieChartProps) {
  const center = size / 2;
  const svgRef = useRef<SVGSVGElement>(null);

  const [hovered, setHovered] = useState<{
    seriesIndex: number;
    sliceIndex: number;
  } | null>(null);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label?: string;
    value?: number;
    percentage?: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    label: "",
    value: 0,
    percentage: "",
  });

  function renderSlice(
    slice: PieChartSlice,
    sliceIndex: number,
    seriesIndex: number,
    startAngle: number,
    endAngle: number,
    baseInnerRadius: number,
    baseOuterRadius: number,
    gapWidth: number,
    total: number
  ) {
    const isHovered =
      hovered?.seriesIndex === seriesIndex &&
      hovered?.sliceIndex === sliceIndex;
    const isDimmed = hovered && !isHovered;

    const outerRadius = isDimmed ? baseOuterRadius * 0.9 : baseOuterRadius;
    const innerRadius = baseInnerRadius;

    const outerGapAngle = gapWidth / outerRadius;
    const innerGapAngle = gapWidth / innerRadius;

    const adjustedStartAngle = startAngle + outerGapAngle / 2;
    const adjustedEndAngle = endAngle - outerGapAngle / 2;
    const adjustedStartAngleInner = startAngle + innerGapAngle / 2;
    const adjustedEndAngleInner = endAngle - innerGapAngle / 2;

    const x1 = center + outerRadius * Math.cos(adjustedStartAngle);
    const y1 = center + outerRadius * Math.sin(adjustedStartAngle);
    const x2 = center + outerRadius * Math.cos(adjustedEndAngle);
    const y2 = center + outerRadius * Math.sin(adjustedEndAngle);

    const x3 = center + innerRadius * Math.cos(adjustedEndAngleInner);
    const y3 = center + innerRadius * Math.sin(adjustedEndAngleInner);
    const x4 = center + innerRadius * Math.cos(adjustedStartAngleInner);
    const y4 = center + innerRadius * Math.sin(adjustedStartAngleInner);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    const percentage = ((slice.value / total) * 100).toFixed(1) + "%";

    return (
      <path
        key={`${seriesIndex}-${sliceIndex}`}
        d={pathData}
        fill={slice.color}
        onClick={slice.onClick}
        onMouseEnter={(e) => {
          if (!svgRef.current) return;

          const svgRect = svgRef.current.getBoundingClientRect();
          const mouseX = e.clientX - svgRect.left;
          const mouseY = e.clientY - svgRect.top;

          setHovered({ seriesIndex, sliceIndex });
          setTooltip({
            visible: true,
            x: mouseX,
            y: mouseY,
            label: slice.label,
            value: slice.value,
            percentage,
          });
        }}
        onMouseMove={(e) => {
          if (!svgRef.current) return;

          const svgRect = svgRef.current.getBoundingClientRect();
          const mouseX = e.clientX - svgRect.left;
          const mouseY = e.clientY - svgRect.top;

          setTooltip((prev) => ({
            ...prev,
            x: mouseX + 10,
            y: mouseY + 22,
          }));
        }}
        onMouseLeave={() => {
          setHovered(null);
          setTooltip((prev) => ({ ...prev, visible: false }));
        }}
        style={{
          cursor: slice.onClick ? "pointer" : "default",
          opacity: isDimmed ? 0.5 : 1,
          transition: "0.3s ease",
        }}
      />
    );
  }

  let svgSlices: React.ReactNode[] = [];

  series.forEach((s, seriesIndex) => {
    const { data, innerRadius, outerRadius, gapWidth = 4 } = s;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;

    data.forEach((slice, sliceIndex) => {
      const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      const endAngle =
        ((cumulative + slice.value) / total) * 2 * Math.PI - Math.PI / 2;

      cumulative += slice.value;

      svgSlices.push(
        renderSlice(
          slice,
          sliceIndex,
          seriesIndex,
          startAngle,
          endAngle,
          innerRadius,
          outerRadius,
          gapWidth,
          total
        )
      );
    });
  });

  return (
    <>
      <svg ref={svgRef} width={size} height={size}>
        {svgSlices}
      </svg>

      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: "6px",
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, 0%)",
            pointerEvents: "none",
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            zIndex: 1000,
          }}
        >
          {tooltip.label && <div>{tooltip.label}</div>}
          <div>{tooltip.value}</div>
          {tooltip.percentage && <div>({tooltip.percentage})</div>}
        </div>
      )}
    </>
  );
}
