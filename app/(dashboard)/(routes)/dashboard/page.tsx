import DashboardHeader from "./_components/dashboard-header"
import ResourceCard3 from "@/components/cards/resource-card-3"
import ResourceCard2 from "@/components/cards/resource-card-2"
import ResourceCard from "@/components/cards/resource-card"

export default function DashboardPage() {
  return (
    <div className="container mt-3">
      <DashboardHeader />
      <div className="grid lg:grid-cols-2 grid-cols-1">
        <div className="p-5">
          <div className="pt-3">
            <ResourceCard2 />
          </div>
          <div className="pt-3">
            <ResourceCard />
          </div>
        </div>
        <div className="p-5">
          <div className="pt-3">
            <ResourceCard3 />
          </div>
          <div className="pt-3">
            <ResourceCard3 />
          </div>
          <div className="pt-3">
            <ResourceCard3 />
          </div>
          <div className="pt-3">
            <ResourceCard3 />
          </div>
        </div>
      </div>
    </div>
  )
}
