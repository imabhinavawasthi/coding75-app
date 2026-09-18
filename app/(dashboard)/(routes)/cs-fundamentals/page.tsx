import ImageCard3 from "@/components/cards/image-card-3";
import PremiumPageHeader from "@/components/page-headers/premium-page-header";
import OS from "../../../../public/images/operating-system.png";
import CS from "../../../../public/images/computer-fundamentals.png";
import OOPS from "../../../../public/images/oops.png";
import CN from "../../../../public/images/computer-networks.png";
import SQL from "../../../../public/images/sql.png";
import DSA from "../../../../public/images/dsa-theory.png";
import DBMS from "../../../../public/images/dbms.png";

const CSFundamentals = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
            <PremiumPageHeader
                title={<span>CS <span className="text-primary">Fundamentals</span></span>}
                subtitle="Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Programming interview-specific resources."
            />

            <div className="mt-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                    <div>
                        <ImageCard3
                            image={OS}
                            title="Operating System"
                            href="/cs-fundamentals/operating-system"
                        />
                    </div>
                    <div>
                        <ImageCard3
                            image={OOPS}
                            title="Object Oriented Programming"
                            href="/cs-fundamentals/oops"
                        />
                    </div>
                    <div>
                        <ImageCard3
                            image={DBMS}
                            title="Database Management System"
                            href="/cs-fundamentals/dbms"
                        />
                    </div>
                    <div>
                        <ImageCard3
                            image={CN}
                            title="Computer Networks"
                            href="/cs-fundamentals/computer-networks"
                        />
                    </div>
                    <div>
                        <ImageCard3
                            image={SQL}
                            title="Structured query language (SQL)"
                            href="/cs-fundamentals/sql"
                        />
                    </div>
                    <div>
                        <ImageCard3
                            image={DSA}
                            title="DSA Theory Questions"
                            href="/cs-fundamentals/dsa"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CSFundamentals;