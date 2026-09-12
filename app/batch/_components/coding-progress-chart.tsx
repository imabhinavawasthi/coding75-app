"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Award, Code2, Flame, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SnapshotPoint {
    synced_at: string;
    main_rating: number;
    total_solved: number;
    leetcode?: { rating: number; solved: number };
    codeforces?: { rating: number; solved: number };
    codechef?: { rating: number; solved: number };
}

interface CodingProgressChartProps {
    latest: SnapshotPoint | null;
    history: SnapshotPoint[];
}

type MetricType = "total_solved" | "main_rating" | "leetcode_rating" | "codeforces_rating" | "codechef_rating";

export function CodingProgressChart({ latest, history }: CodingProgressChartProps) {
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("total_solved");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Combine history + latest chronologically (oldest to newest)
    const chartData = useMemo(() => {
        if (!latest) return [];
        const combined = [...(history || []).slice().reverse(), latest];
        return combined.map((snap) => {
            const d = new Date(snap.synced_at);
            const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
            const fullDateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

            return {
                dateStr,
                fullDateStr,
                total_solved: snap.total_solved || 0,
                main_rating: snap.main_rating || 0,
                leetcode_rating: snap.leetcode?.rating || 0,
                codeforces_rating: snap.codeforces?.rating || 0,
                codechef_rating: snap.codechef?.rating || 0,
            };
        });
    }, [latest, history]);

    // Metric configuration
    const metricConfig = useMemo(() => {
        switch (selectedMetric) {
            case "total_solved":
                return {
                    label: "Total Problems Solved",
                    color: "#059669", // emerald-600
                    gradientId: "emeraldGrad",
                    strokeColor: "#10b981",
                    unit: "problems",
                    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                };
            case "main_rating":
                return {
                    label: "Main Overall Rating",
                    color: "#7c3aed", // violet-600
                    gradientId: "purpleGrad",
                    strokeColor: "#8b5cf6",
                    unit: "pts",
                    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
                };
            case "leetcode_rating":
                return {
                    label: "LeetCode Contest Rating",
                    color: "#d97706", // amber-600
                    gradientId: "amberGrad",
                    strokeColor: "#f59e0b",
                    unit: "pts",
                    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
                };
            case "codeforces_rating":
                return {
                    label: "Codeforces Rating",
                    color: "#2563eb", // blue-600
                    gradientId: "blueGrad",
                    strokeColor: "#3b82f6",
                    unit: "pts",
                    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
                };
            case "codechef_rating":
                return {
                    label: "CodeChef Rating",
                    color: "#ca8a04", // yellow-600
                    gradientId: "yellowGrad",
                    strokeColor: "#eab308",
                    unit: "pts",
                    badgeBg: "bg-yellow-50 text-yellow-700 border-yellow-200",
                };
        }
    }, [selectedMetric]);

    // SVG Layout Dimensions
    const width = 800;
    const height = 260;
    const padding = { top: 25, right: 35, bottom: 40, left: 60 };

    // Calculate Y scale
    const values = chartData.map((d) => d[selectedMetric]);
    const rawMin = values.length > 0 ? Math.min(...values) : 0;
    const rawMax = values.length > 0 ? Math.max(...values) : 100;

    // Buffer on min/max
    const span = Math.max(1, rawMax - rawMin);
    const yMin = Math.max(0, Math.floor(rawMin - span * 0.15));
    const yMax = Math.ceil(rawMax + span * 0.15);

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    // Coordinate mapping
    const points = useMemo(() => {
        if (chartData.length === 0) return [];
        if (chartData.length === 1) {
            const x = padding.left + innerWidth / 2;
            const y = padding.top + innerHeight / 2;
            return [{ x, y, data: chartData[0], val: chartData[0][selectedMetric] }];
        }

        return chartData.map((d, i) => {
            const x = padding.left + (i / (chartData.length - 1)) * innerWidth;
            const normY = (d[selectedMetric] - yMin) / (yMax - yMin || 1);
            const y = padding.top + innerHeight - normY * innerHeight;
            return { x, y, data: d, val: d[selectedMetric] };
        });
    }, [chartData, selectedMetric, yMin, yMax, innerWidth, innerHeight]);

    // Construct smooth bezier curve path
    const { linePath, areaPath } = useMemo(() => {
        if (points.length < 2) {
            return { linePath: "", areaPath: "" };
        }

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i != points.length - 2 ? points[i + 2] : p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        const baselineY = padding.top + innerHeight;
        const area = `${d} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

        return { linePath: d, areaPath: area };
    }, [points, padding.top, innerHeight]);

    // Grid ticks (4 horizontal lines)
    const yTicks = useMemo(() => {
        const ticks: { val: number; y: number }[] = [];
        const count = 4;
        for (let i = 0; i <= count; i++) {
            const val = Math.round(yMin + (i / count) * (yMax - yMin));
            const y = padding.top + innerHeight - (i / count) * innerHeight;
            ticks.push({ val, y });
        }
        return ticks;
    }, [yMin, yMax, padding.top, innerHeight]);

    const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : points[points.length - 1];
    const prevPoint = hoveredIndex !== null && hoveredIndex > 0 ? points[hoveredIndex - 1] : points.length > 1 ? points[points.length - 2] : null;
    const diff = activePoint && prevPoint ? activePoint.val - prevPoint.val : 0;

    return (
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                Growth & Improvement Area Chart
                            </CardTitle>
                        </div>
                        <CardDescription className="text-xs mt-0.5">
                            Interactive visual progression tracking weekly checkpoints across all coding platforms
                        </CardDescription>
                    </div>

                    {/* Metric Selectors / Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setSelectedMetric("total_solved")}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${selectedMetric === "total_solved" ? "bg-white text-emerald-800 shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            Total Solved
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedMetric("main_rating")}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${selectedMetric === "main_rating" ? "bg-white text-purple-800 shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            Overall Rating
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedMetric("leetcode_rating")}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${selectedMetric === "leetcode_rating" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            LeetCode
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedMetric("codeforces_rating")}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${selectedMetric === "codeforces_rating" ? "bg-white text-blue-800 shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            Codeforces
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedMetric("codechef_rating")}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${selectedMetric === "codechef_rating" ? "bg-white text-yellow-800 shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            CodeChef
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Active Hover / Current Value Stats Bar */}
                {activePoint && (
                    <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-xs" style={{ backgroundColor: metricConfig.color }}>
                                {selectedMetric === "total_solved" ? <Code2 className="w-5 h-5" /> : selectedMetric === "leetcode_rating" ? "LC" : selectedMetric === "codeforces_rating" ? "CF" : selectedMetric === "codechef_rating" ? "CC" : <Award className="w-5 h-5" />}
                            </div>
                            <div>
                                <span className="text-[11px] text-gray-500 font-medium block">
                                    {metricConfig.label} ({activePoint.data.fullDateStr})
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-black text-gray-900">
                                        {activePoint.val.toLocaleString()} {metricConfig.unit}
                                    </span>
                                    {diff !== 0 && (
                                        <Badge className={`text-[10px] font-bold ${diff > 0 ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                                            {diff > 0 ? `+${diff}` : diff} vs previous checkpoint
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-right text-[11px] text-gray-500">
                            <span>Hover over chart checkpoints to inspect weekly progress</span>
                        </div>
                    </div>
                )}

                {/* SVG Area Chart Container */}
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                        <svg
                            viewBox={`0 0 ${width} ${height}`}
                            className="w-full h-auto select-none"
                            style={{ overflow: "visible" }}
                        >
                            <defs>
                                <linearGradient id={metricConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={metricConfig.color} stopOpacity="0.32" />
                                    <stop offset="65%" stopColor={metricConfig.color} stopOpacity="0.08" />
                                    <stop offset="100%" stopColor={metricConfig.color} stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Y-Axis Grid Lines and Labels */}
                            {yTicks.map((t, idx) => (
                                <g key={idx}>
                                    <line
                                        x1={padding.left}
                                        y1={t.y}
                                        x2={width - padding.right}
                                        y2={t.y}
                                        stroke="#f1f5f9"
                                        strokeWidth="1"
                                        strokeDasharray={idx === 0 ? "none" : "3,3"}
                                    />
                                    <text
                                        x={padding.left - 10}
                                        y={t.y + 3.5}
                                        textAnchor="end"
                                        fontSize="10"
                                        fill="#94a3b8"
                                        fontFamily="sans-serif"
                                    >
                                        {t.val}
                                    </text>
                                </g>
                            ))}

                            {/* Area Gradient Fill */}
                            {areaPath && (
                                <path
                                    d={areaPath}
                                    fill={`url(#${metricConfig.gradientId})`}
                                />
                            )}

                            {/* Main Smooth Line */}
                            {linePath && (
                                <path
                                    d={linePath}
                                    fill="none"
                                    stroke={metricConfig.strokeColor}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}

                            {/* Crosshair on hover */}
                            {hoveredIndex !== null && points[hoveredIndex] && (
                                <line
                                    x1={points[hoveredIndex].x}
                                    y1={padding.top}
                                    x2={points[hoveredIndex].x}
                                    y2={padding.top + innerHeight}
                                    stroke="#cbd5e1"
                                    strokeWidth="1"
                                    strokeDasharray="3,3"
                                />
                            )}

                            {/* Interactive Data Points and Tooltip Triggers */}
                            {points.map((p, idx) => {
                                const isHovered = hoveredIndex === idx;
                                const isLatest = idx === points.length - 1;

                                return (
                                    <g
                                        key={idx}
                                        className="cursor-pointer group"
                                        onMouseEnter={() => setHoveredIndex(idx)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        {/* Invisible larger hit target */}
                                        <circle
                                            cx={p.x}
                                            y={p.y}
                                            r="16"
                                            fill="transparent"
                                        />

                                        {/* Outer ring for hovered or latest */}
                                        {(isHovered || isLatest) && (
                                            <circle
                                                cx={p.x}
                                                cy={p.y}
                                                r={isHovered ? "8" : "6"}
                                                fill={metricConfig.color}
                                                opacity={isHovered ? "0.3" : "0.15"}
                                            />
                                        )}

                                        {/* Core Point Dot */}
                                        <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r={isHovered ? "5.5" : isLatest ? "4.5" : "3.5"}
                                            fill="#ffffff"
                                            stroke={metricConfig.color}
                                            strokeWidth={isHovered ? "3" : "2.5"}
                                        />

                                        {/* X-Axis Date Label */}
                                        <text
                                            x={p.x}
                                            y={padding.top + innerHeight + 20}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill={isHovered ? "#0f172a" : "#94a3b8"}
                                            fontWeight={isHovered ? "700" : "400"}
                                        >
                                            {p.data.dateStr}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
