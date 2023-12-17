'use client';

import Footer from "../footer";
import Community from "./community";
import FeatureSection from "./feature-section";
import HeaderSection from "./header-section";


export default function LandingPage() {

    return (
        <div>
            <HeaderSection/>
            <FeatureSection/>
            {/* <BlogSection/> */}
            <div className="container pl-20">
            <Community/>
            </div>
            <Footer/>
        </div>
    )
}
