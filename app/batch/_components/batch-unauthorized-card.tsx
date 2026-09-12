"use client";

import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BatchUnauthorizedCardProps {
    batchName?: string;
    batchId?: string;
}

export function BatchUnauthorizedCard({ batchName, batchId }: BatchUnauthorizedCardProps) {
    return (
        <div className="container max-w-3xl mx-auto px-4 py-16">
            <Card className="border-amber-200 bg-amber-50/40 shadow-lg">
                <CardHeader className="text-center pb-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                        <Lock className="w-6 h-6 text-amber-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Enrollment Required
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                        You are not enrolled in batch: <span className="font-semibold text-gray-900">{batchName || batchId}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                        This batch is reserved for enrolled students only. If you have already enrolled, ensure you are logged in with your registered email address or contact support.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link href="/classroom">
                            <Button variant="outline">
                                Return to Classroom
                            </Button>
                        </Link>
                        <Link href="/pro">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                Explore Courses & Batches
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
