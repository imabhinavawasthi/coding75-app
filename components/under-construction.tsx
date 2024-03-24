const UnderConstruction = () => {
    return (
        <div>
            <div className="flex h-screen flex-col bg-white">

                <div className="flex flex-1 items-center justify-center">
                    <div className="mx-auto max-w-xl px-4 py-8 text-center pb-40">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Under Construction 🚧: Exciting Content Coming Soon!
                        </h1>

                        <p className="mt-4 text-gray-500">
                        Our Team is in the process of crafting valuable resources on this page. Stay tuned for amazing resources!
                        </p>
                        <p className="mt-2 text-gray-500">Interested in contributing your expertise to make this resource even better? Mail us at <a className="text-indigo-400" href="mailto:info@coding75.com">info@coding75.com</a> or Whatsapp <a className="text-indigo-400" target="_blank" href="https://wa.me/message/TPN76XLWVOWDB1">Here</a></p>

                        <a
                            href="/dashboard"
                            className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
                        >
                            Go Back Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnderConstruction;