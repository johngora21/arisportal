import React from 'react';

type BarChartProps = {
  labels: string[];
  values: number[]; // 0-100 scale
  height?: number; // px
};

export const BarChart: React.FC<BarChartProps> = ({ labels, values, height = 220 }) => {
  const max = 100;
  const paddingLeft = 36; // space for y-axis labels
  const paddingBottom = 28; // space for x labels
  const width = 600; // viewBox width (scales to container)
  const innerWidth = width - paddingLeft - 12;
  const innerHeight = height - paddingBottom - 8;
  const barGap = 14;
  const barWidth = (innerWidth - barGap * (values.length - 1)) / values.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }} role="img" aria-label="Capital Readiness Assessment Scores">
      {/* Y-axis and ticks */}
      <line x1={paddingLeft} y1={8} x2={paddingLeft} y2={8 + innerHeight} stroke="#e5e7eb" />
      {[0, 25, 50, 75, 100].map((t) => {
        const y = 8 + innerHeight - (t / max) * innerHeight;
        return (
          <g key={t}>
            <line x1={paddingLeft} y1={y} x2={paddingLeft + innerWidth} y2={y} stroke="#f1f5f9" />
            <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#64748b">{t}</text>
          </g>
        );
      })}

      {/* Bars */}
      {values.map((v, i) => {
        const h = (Math.max(0, Math.min(v, max)) / max) * innerHeight;
        const x = paddingLeft + i * (barWidth + barGap);
        const y = 8 + innerHeight - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} rx={8} ry={8} fill="var(--mc-sidebar-bg)" />
          </g>
        );
      })}

      {/* X labels */}
      {labels.map((label, i) => {
        const x = paddingLeft + i * (barWidth + barGap) + barWidth / 2;
        const y = 8 + innerHeight + 16;
        return (
          <text key={label} x={x} y={y} textAnchor="middle" fontSize={12} fill="var(--mc-sidebar-bg)">{label}</text>
        );
      })}
    </svg>
  );
};

export default BarChart;


