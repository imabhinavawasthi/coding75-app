"use client";

import { useParams } from "next/navigation";
import { StudentProgressView } from "@/app/batch/_components/student-progress-view";

export default function StudentProgressPage() {
    const params = useParams();
    const batchId = (params?.batchId as string) || "";
    const studentId = (params?.studentId as string) || "";

    return <StudentProgressView batchId={batchId} studentId={studentId} />;
}
