import ResourceCard from "@/components/cards/resource-card";
import ResourceCard2 from "@/components/cards/resource-card-2";


const ResourcesPage = () => {
    return (
        <div className="container mt-3">
            <section className="bg-gray-50">
                <div className="max-w-screen-xl px-4 py-10">
                    <div className="mx-auto max-w-xl text-center">
                        <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Comprehensive Tech 
                            <strong className="font-extrabold text-indigo-700 sm:block"> Resource Hub 📚 </strong>
                        </h1>

                        <p className="mt-4 sm:text-xl/relaxed">
                        From coding resources and interview preparation to project inspiration and career guidance, access everything you need in one convenient place.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ResourcesPage;