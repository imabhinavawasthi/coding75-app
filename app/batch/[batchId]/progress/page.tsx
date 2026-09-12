"use client";

import { useParams } from "next/navigation";
import { StudentProgressView } from "@/app/batch/_components/student-progress-view";

export default function BatchProgressPage() {
    const params = useParams();
    const batchId = (params?.batchId as string) || "";
    return <StudentProgressView batchId={batchId} />;
}
