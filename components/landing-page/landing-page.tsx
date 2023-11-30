'use client';

import Footer from "../footer";
import BlogSection from "./blog-section";
import FeatureSection from "./feature-section";
import HeaderSection from "./header-section";


export default function LandingPage() {

    return (
        <div>
            <HeaderSection/>
            <FeatureSection/>
            <BlogSection/>
            <Footer/>
        </div>
    )
}
