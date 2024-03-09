import Link from "next/link";
import { Card, CardContent } from "../ui/card";

export default function ProductCard({ title, description, icon: IconComponent, href, href_text="Explore" }: any) {
    return (
        <Link href={href}>
            <Card className="h-full shadow-lg hover:shadow-inner">
                <CardContent className="mt-5">
                <div className="flex items-center">
                <span className="inline-block rounded bg-blue-600 p-2 text-white">
                    <IconComponent className="h-6 w-6" />
                </span>
                <h3 className="ml-2 hover:underline text-lg font-medium text-gray-900">
                    {title}
                </h3>
                </div>

                <p className="mt-4 line-clamp-3 text-sm/relaxed text-gray-500">
                    {description}
                </p>

                <div className="group inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                    {href_text}

                    <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
                        &rarr;
                    </span>
                </div>
                </CardContent>
            </Card>
        </Link>
    )
}