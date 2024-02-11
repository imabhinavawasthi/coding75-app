'use client';

import Footer from "../footer";
import Community from "./community";
import FeatureSection from "./feature-section";
import FeatureSection2 from "./feature-section-2";
import HeaderSection from "./header-section";


export default function LandingPage() {

    return (
        <div>
            <HeaderSection/>
            <FeatureSection/>
            <FeatureSection2/>
            {/* <BlogSection/> */}
            <div className="container lg:pl-20">
            <Community/>
            </div>
            <Footer/>
        </div>
    )
}
