import { Button } from "../ui/button";

const PosterCard = () => {
    return (
        <>
                <div className="absolute h-56 w-40 -translate-x-1/2 -translate-y-1/2 rotate-6 rounded-2xl bg-gray-400"></div>

                <div className="absolute  h-56 w-40 -translate-x-1/2 -translate-y-1/2 rotate-6 space-y-2 rounded-2xl bg-gray-100 p-6 transition duration-300 hover:rotate-0">
                    <div className="flex justify-end">
                        <div className="h-2 w-2 rounded-full bg-gray-900"></div>
                    </div>

                    <header className="text-center text-sm font-extrabold text-gray-600">2021.09.01</header>

                    <div>
                        <p className="text-center text-lg font-extrabold text-gray-900">Online Test (Physics)</p>
                        <p className="text-center text-lg font-extrabold text-[#FE5401]">2 hours</p>
                    </div>

                    <footer className="flex justify-center">
                        <Button className="bg-[#FE5401]">
                            Start
                        </Button>
                    </footer>
                </div>
            </>
    );
}

export default PosterCard;