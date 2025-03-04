// app/about/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import {
  LuArrowRight,
  LuGithub,
  LuCode,
  LuBrain,
  LuCodeXml,
} from "react-icons/lu";

export const metadata: Metadata = {
  title: "About Deepseek Playground - AI Testing Platform | CRTVAI",
  description:
    "Learn about Deepseek Playground, an advanced AI playground for testing and experimenting with DeepSeek language models. Developed by CRTVAI.",
};

export default function AboutPage() {
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
          About Deepseek Playground
        </h1>

        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Empowering AI Innovation
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Deepseek Playground is an advanced platform for testing and
            experimenting with state-of-the-art language models. Developed by{" "}
            <a
              href="https://www.crtvai.com"
              className="hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              CRTVAI
            </a>
            , we provide developers and researchers with powerful tools to
            explore AI capabilities.
          </p>
        </section>

        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<LuBrain className="w-6 h-6" />}
              title="Advanced Model Access"
              description="Direct access to DeepSeek's latest language models"
            />
            <FeatureCard
              icon={<LuCode className="w-6 h-6" />}
              title="Customizable Parameters"
              description="Fine-tune model responses with adjustable parameters"
            />
            <FeatureCard
              icon={<LuCodeXml className="w-6 h-6" />}
              title="Real-time Testing"
              description="Instant feedback and results for rapid prototyping"
            />
            <FeatureCard
              icon={<LuGithub className="w-6 h-6" />}
              title="Developer-Friendly"
              description="Intuitive interface for all skill levels"
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
            Visit CRTVAI
            <LuArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
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
