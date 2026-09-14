import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    problem: string;
  }>;
}

export default async function LegacyPOTDProblemPage({ params }: PageProps) {
  const { problem } = await params;
  redirect(`/contests/leetcode-potd/${problem}`);
}
