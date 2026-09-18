"use client";

import ComingSoon from "@/components/coming-soon";
import { GitFork, Layers, Database, Cpu, Network, Server } from "lucide-react";

export default function SystemDesignPage() {
  return (
    <ComingSoon
      title="System Design (HLD & LLD)"
      subtitle="Distributed Systems, Scalability & Object-Oriented Architecture"
      description="We are building an intensive, production-oriented system design curriculum covering high-level distributed architecture, low-level object-oriented design, databases, caching, and real-world system design interview debriefs."
      badge="Curriculum In Development"
      badgeColor="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
      icon={GitFork}
      iconColor="text-indigo-600 dark:text-indigo-400"
      iconBg="bg-indigo-500/15 border-indigo-500/25"
      eta="Target Launch: Q4 2026"
      features={[
        {
          title: "High-Level Design (HLD)",
          description: "Distributed caching (Redis/Memcached), message brokers (Kafka/RabbitMQ), database sharding, replication, and load balancing.",
          icon: Network,
        },
        {
          title: "Low-Level Design (LLD)",
          description: "SOLID design principles, Design Patterns, clean object-oriented modeling, thread safety, and concurrency in Java/C++/Go.",
          icon: Cpu,
        },
        {
          title: "Real-World Architecture Blueprints",
          description: "End-to-end breakdowns of Uber, YouTube, Distributed Rate Limiters, WhatsApp, and Web Crawlers.",
          icon: Server,
        },
      ]}
    />
  );
}