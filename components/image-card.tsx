import {
    ChevronDownIcon,
    CircleIcon,
    PlusIcon,
    Share1Icon,
    StarIcon,
} from "@radix-ui/react-icons"
import Image from 'next/image'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Code2, Rocket } from "lucide-react"

export default function ImageCard() {
    return (
        <Link href="/dsa-cp">
        <Card className="shadow-lg hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] mt-3">
            <CardHeader className="grid items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle>shadcn/ui vch eck dqef de</CardTitle>
                    <CardDescription>
                        Description
                    </CardDescription>
                </div>
                {/* <div className="">
                    <Button variant="secondary">
                        <Rocket className="mr-3 h-3 w-3" />
                        Explore
                    </Button>
                </div> */}
            </CardHeader>
            <CardContent>
                <div>
                    <Image
                        src="/logo.png"
                        width={500}
                        height={500}
                        alt="Card Image"
                    />
                </div>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                        TypeScript
                    </div>
                    <div className="flex items-center">
                        <StarIcon className="mr-1 h-3 w-3" />
                        20k
                    </div>
                    <div>Updated April 2023</div>
                </div>
            </CardContent>
        </Card>
        </Link>
    )
}