"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { 
  Hash, 
  LayoutList, 
  Type, 
  Network, 
  GitMerge, 
  BrainCircuit, 
  GitCommit, 
  Maximize2, 
  Layers, 
  AlignEndHorizontal, 
  Link as LinkIcon, 
  Calculator, 
  Search,
  Database,
  Box,
  Code2,
  ListOrdered
} from "lucide-react";

export interface TopicIconProps {
  topicName: string;
  iconName?: string;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
}

export const TopicIcon: React.FC<TopicIconProps> = ({ 
  topicName, 
  iconName, 
  size = 20, 
  strokeWidth = 2, 
  className 
}) => {
  // If explicitly provided a valid icon string from AI, use it
  if (iconName && iconName in LucideIcons) {
    const Icon = (LucideIcons as any)[iconName];
    if (Icon) {
      return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
    }
  }

  const name = topicName.toLowerCase();
  
  // Deterministic mapping based on common DSA topics
  if (name.includes("array") || name.includes("matrix")) return <LayoutList size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("string")) return <Type size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("tree") || name.includes("trie")) return <Network size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("graph")) return <GitMerge size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("dynamic programming") || name.match(/\bdp\b/)) return <BrainCircuit size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("pointer")) return <GitCommit size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("window")) return <Maximize2 size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("stack")) return <Layers size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("queue")) return <AlignEndHorizontal size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("list")) return <LinkIcon size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("math") || name.includes("bit") || name.includes("number")) return <Calculator size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("search") || name.includes("sort")) return <Search size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("heap") || name.includes("priority")) return <ListOrdered size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("hash") || name.includes("map") || name.includes("dict")) return <Database size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("greedy")) return <Box size={size} strokeWidth={strokeWidth} className={className} />;
  if (name.includes("recursion") || name.includes("backtrack")) return <Code2 size={size} strokeWidth={strokeWidth} className={className} />;
  
  // Default fallback
  return <Hash size={size} strokeWidth={strokeWidth} className={className} />;
};
