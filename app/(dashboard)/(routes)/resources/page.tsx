import ResourceCard from "@/components/cards/resource-card";
import ResourceCard2 from "@/components/cards/resource-card-2";


const ResourcesPage = () => {
    return (
        <div className="container mt-3">
            <div className="grid lg:grid-cols-2 grid-cols-1">
                <div className="p-5">
                    <ResourceCard />
                </div>
                <div className="p-5">
                    <ResourceCard />
                </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1">
                <div className="p-5">
                    {/* <ResourceCard2 /> */}
                </div>
                <div className="p-5">
                    {/* <ResourceCard2 /> */}
                </div>
            </div>
        </div>
    );
}

export default ResourcesPage;