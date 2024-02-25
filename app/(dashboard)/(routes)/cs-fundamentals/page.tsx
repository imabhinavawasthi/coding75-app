import ImageCard3 from "@/components/cards/image-card-3";
import ResourceCard3 from "@/components/cards/resource-card-3";
import PageHeaders from "@/components/page-headers/page-headers";

const CSFundamentals = () => {
    return (
        <div>
            <div>
                <PageHeaders
                greenHeading="Fundamentals"
                    heading="CS"
                    description="Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Programming Interview Specific Resources. " />
            </div>
            
            <div className="mt-5 container">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 lg:gap-x-10 lg:px-10 gap-4">
                    <div>
                        <ImageCard3
                        image="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/operating-system.png"
                        title="Operating System"
                        href="/cs-fundamentals/operating-system"
                        />
                    </div>
                    <div>
                    <ImageCard3
                        image="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/computer-networks.png"
                        title="Computer Networks"
                        href="/cs-fundamentals/computer-networks"
                        />
                    </div>
                    <div>
                    <ImageCard3
                        image="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/dbms.png"
                        title="Database Management System"
                        href="/cs-fundamentals/dbms"
                        />
                    </div>
                    <div>
                    <ImageCard3
                        image="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/oops.png"
                        title="Object Oriented Programming"
                        href="/cs-fundamentals/oops"
                        />
                    </div>
                    <div>
                    <ImageCard3
                        image="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/sql.png"
                        title="Structured query language (SQL)"
                        href="/cs-fundamentals/sql"
                        />
                    </div>
                    <div>
                    <ImageCard3
                        image="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/dsa-theory.png"
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