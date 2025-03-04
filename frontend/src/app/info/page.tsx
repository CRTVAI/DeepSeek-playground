// app/info/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import {
  LuArrowRight,
  LuCode,
  LuBrain,
  LuDatabase,
  LuGlobe,
  LuLayoutGrid,
} from "react-icons/lu";

export const metadata: Metadata = {
  title:
    "Deepseek AI Platform Information - Next Generation Language Models | CRTVAI",
  description:
    "Detailed information about Deepseek AI platform, capabilities, and integration options. Learn how CRTVAI brings advanced AI solutions to your business.",
};

export default function InfoPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          Deepseek AI Platform
        </h1>

        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Platform Overview
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Deepseek is a cutting-edge AI platform that rivals leading language
            models in performance and capabilities. Developed and maintained by{" "}
            <a
              href="https://www.crtvai.com"
              className="hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              CRTVAI
            </a>
            , our platform offers state-of-the-art natural language processing
            capabilities.
          </p>
        </section>

        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpecCard
              icon={<LuBrain />}
              title="Model Architecture"
              items={[
                "Advanced MoE architecture",
                "Optimized inference speed",
                "Enhanced context understanding",
                "Multi-language support",
              ]}
            />
            <SpecCard
              icon={<LuCode />}
              title="Performance Metrics"
              items={[
                "High accuracy in language tasks",
                "Superior code generation",
                "Advanced mathematical reasoning",
                "Robust multilingual support",
              ]}
            />
          </div>
        </section>

        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Integration Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntegrationCard
              icon={<LuGlobe />}
              title="API Access"
              description="RESTful API endpoints for seamless integration"
            />
            <IntegrationCard
              icon={<LuLayoutGrid />}
              title="SDK Support"
              description="Development kits in multiple languages"
            />
            <IntegrationCard
              icon={<LuCode />}
              title="Custom Solutions"
              description="Tailored implementations for your needs"
            />
            <IntegrationCard
              icon={<LuDatabase />}
              title="Enterprise Support"
              description="Dedicated assistance for large-scale use"
            />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors"
            style={{
              background: "var(--accent)",
              color: "var(--background)",
            }}
          >
            Try Playground
            <LuArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://www.crtvai.com"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors"
            style={{
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              border: "1px solid var(--card-border)",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
            <LuArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}

function SpecCard({ icon, title, items }: any) {
  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" style={{ color: "var(--accent)" }}>
          {icon}
        </span>
        <h3
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item: any, index: number) => (
          <li
            key={index}
            className="flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            ></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IntegrationCard({ icon, title, description }: any) {
  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" style={{ color: "var(--accent)" }}>
          {icon}
        </span>
        <h3
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      </div>
      <p style={{ color: "var(--text-secondary)" }}>{description}</p>
    </div>
  );
}
