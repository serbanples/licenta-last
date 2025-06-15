import React from 'react';

interface CircularProgressProps {
  /** Percentage from 0 to 100 */
  percent: number;
  /** Diameter of the circle in pixels */
  size?: number;
  /** Width of the progress stroke */
  strokeWidth?: number;
  /** Color of the progress stroke */
  strokeColor?: string;
  /** Color of the track (background circle) */
  trackColor?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percent,
  size = 48,
  strokeWidth = 4,
  strokeColor = '#3b82f6', // Tailwind blue-500
  trackColor = '#e5e7eb', // Tailwind gray-200
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);

  return (
    <svg width={size} height={size}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Percentage text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={size * 0.4}
        fill="#111827" /* Tailwind gray-900 */
      >
        {Math.round(percent)}%
      </text>
    </svg>
  );
};
