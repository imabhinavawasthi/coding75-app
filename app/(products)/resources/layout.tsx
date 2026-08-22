import { FlickeringGrid } from "@/app/(ui)/(components)/flickering-grid"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="min-w-screen relative min-h-screen w-full overflow-hidden">
                <FlickeringGrid
                    className="absolute inset-0 z-0 h-full w-full"
                    squareSize={4}
                    gridGap={6}
                    color="#6B7280"
                    maxOpacity={0.2}
                    flickerChance={0.1}
                    height={1000}
                    width={2000}
                />
                {children}
            </div>
        </>
    )
}