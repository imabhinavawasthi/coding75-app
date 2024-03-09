"use client"

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function DashboardCard({ title, heading, description, icon: IconComponent, href }: any) {
    return (
        <>
            <Link href={href}>
                <Card className="shadow-lg hover:shadow-inner">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {title}
                        </CardTitle>
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl hover:underline font-bold">{heading} 
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </CardContent>
                </Card>

            </Link>
        </>
    )
}