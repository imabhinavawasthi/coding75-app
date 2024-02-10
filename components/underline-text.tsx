import Image from "next/image";
import UnderlineImage from "../app/(dashboard)/_components/img/underline.png"
import ReactTextTransition, { presets } from "react-text-transition";
import { useEffect, useState } from "react";



const UnderlineText = ({ texts=[""] }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(
            () => setIndex((index) => (index + 1) % texts.length),
            3000, // every 3 seconds
        );
        return () => clearTimeout(intervalId);
    }, []);

    return (
        <div>
            <h1>
                <span className="lg:text-6xl md:text-6xl text-4xl font-extrabold">
                    <section className="inline">
                        {`${texts[index]}`.split("").map((txt, i) => (
                            <ReactTextTransition
                                key={i}
                                className="big"
                                direction="down"
                                inline
                            >
                                <p className="gradient-text">{txt}</p>
                            </ReactTextTransition>
                        ))}
                    </section>
                </span>
                {/* <Image
                    src={UnderlineImage}
                    alt="underline"
                    className="mt-1 w-full h-14 absolute top-2 lg:top-10 md:top-4 left-0"
                /> */}
            </h1>
        </div>
    );
}

export default UnderlineText;