import ImageCard from "@/components/image-card"

export default function Home() {
  return (
    <div className="container mt-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <ImageCard />
        <ImageCard />
        <ImageCard />
        <ImageCard />
      </div>
    </div>
  )
}
