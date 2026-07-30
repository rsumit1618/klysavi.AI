import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Rect, Text as SvgText } from 'react-native-svg';
import { fontFamilies } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

// --- DONUT / PIE CHART COMPONENT ---
export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  size?: number;
  strokeWidth?: number;
  data: ChartSegment[];
  centerTitle?: string;
  centerSubtitle?: string;
}

export function DonutChart({
  size = 180,
  strokeWidth = 24,
  data,
  centerTitle,
  centerSubtitle,
}: DonutChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  let accumulatedAngle = 0;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Subtle Outer Border Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            stroke="#E2E8F0"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Light Soft Background Track Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Light Mint-White Inner Circle Center */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth / 2}
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth={1}
          />
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {data.map((item, index) => {
              const percentage = total > 0 ? item.value / total : 0;
              const strokeDashoffset = circumference * (1 - percentage);
              const angle = accumulatedAngle;
              accumulatedAngle += percentage * 360;

              const isSelected = selectedIndex === index;

              return (
                <Circle
                  key={`segment-${index}`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  rotation={angle}
                  origin={`${size / 2}, ${size / 2}`}
                  strokeLinecap="round"
                  opacity={selectedIndex !== null && !isSelected ? 0.45 : 1}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Content Overlay */}
        <View style={styles.centerOverlay}>
          <Text style={styles.centerTitleText}>
            {selectedIndex !== null
              ? `${Math.round((data[selectedIndex].value / total) * 100)}%`
              : centerTitle || '100%'}
          </Text>
          <Text style={styles.centerSubText}>
            {selectedIndex !== null ? data[selectedIndex].label : centerSubtitle || 'Total'}
          </Text>
        </View>
      </View>

      {/* Legend Items */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => {
          const isSelected = selectedIndex === index;
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

          return (
            <TouchableOpacity
              key={`legend-${index}`}
              style={[styles.legendRow, isSelected && styles.legendRowSelected]}
              onPress={() => setSelectedIndex(isSelected ? null : index)}
              activeOpacity={0.7}
            >
              <View style={styles.legendLeft}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
              </View>
              <Text style={styles.legendValue}>{percent}%</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// --- SPENDING TREND BAR CHART COMPONENT ---
export interface BarDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function SpendingBarChart({
  data,
  height = 140,
  activeColor = colors.darkGreen,
  inactiveColor = '#CBD5E0',
}: BarChartProps) {
  const [activeIdx, setActiveIdx] = useState<number>(data.length - 1);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 30;

  return (
    <View style={[styles.barChartCard, { height }]}>
      <View style={styles.barsRow}>
        {data.map((item, index) => {
          const isSelected = activeIdx === index;
          const barH = (item.value / maxValue) * chartHeight;

          return (
            <TouchableOpacity
              key={`bar-${index}`}
              style={styles.barColumn}
              onPress={() => setActiveIdx(index)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <View style={styles.tooltipBadge}>
                  <Text style={styles.tooltipText}>${item.value}</Text>
                </View>
              )}
              <View style={[styles.barTrack, { height: chartHeight }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: Math.max(barH, 8),
                      backgroundColor: isSelected ? activeColor : inactiveColor,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, isSelected && styles.barLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitleText: {
    fontSize: 22,
    fontFamily: fontFamilies.extraBold,
    color: '#0B3C2D',
  },
  centerSubText: {
    fontSize: 11.5,
    fontFamily: fontFamilies.bold,
    color: '#64748B',
    marginTop: 2,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  legendContainer: {
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  legendRowSelected: {
    backgroundColor: 'rgba(10, 36, 29, 0.08)',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: colors.textDark,
  },
  legendValue: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: colors.textDark,
  },
  // Bar chart styles
  barChartCard: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  tooltipBadge: {
    backgroundColor: colors.darkGreen,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  tooltipText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamilies.bold,
  },
  barTrack: {
    width: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.medium,
    color: colors.textMuted,
    marginTop: 6,
  },
  barLabelActive: {
    fontFamily: fontFamilies.bold,
    color: colors.darkGreen,
  },
});
