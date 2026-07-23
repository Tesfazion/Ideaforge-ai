import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportView from "./report-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const idea = await prisma.idea.findUnique({
    where: { publicSlug: slug },
    include: { report: true },
  });

  if (!idea || !idea.isPublic || !idea.report) {
    return { title: "Not Found — IdeaForge" };
  }

  const score = idea.report.viabilityScore;
  const title = `${idea.title} — Viability Score: ${score}/100 | IdeaForge`;
  const description = `AI-powered validation report for "${idea.title}". Score: ${score}/100. Market: ${idea.report.marketScore}, Competition: ${idea.report.competitorScore}, Monetization: ${idea.report.monetizationScore}.`;
  const url = `https://ideaforge.ai/r/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "IdeaForge",
      type: "article",
      images: [
        {
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&auto=format&q=80",
          width: 1200,
          height: 630,
          alt: `${idea.title} — IdeaForge Report`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&auto=format&q=80"],
    },
  };
}

export default async function PublicReportPage({ params }: PageProps) {
  const { slug } = await params;

  const idea = await prisma.idea.findUnique({
    where: { publicSlug: slug },
    include: { report: true },
  });

  if (!idea || !idea.isPublic || !idea.report) {
    notFound();
  }

  await prisma.idea.update({
    where: { id: idea.id },
    data: { viewCount: { increment: 1 } },
  });

  return <ReportView idea={idea} report={idea.report} />;
}
