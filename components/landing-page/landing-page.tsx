'use client';

import Footer from "../footer";
import { Separator } from "../ui/separator";
import Community from "./community";
import FeatureSection from "./feature-section";
import FeatureSection2 from "./feature-section-2";
import FeatureSection3 from "./feature-section-3";
import HeaderSection from "./header-section";


export default function LandingPage() {

    return (
        <div>
            <HeaderSection/>
            <Separator/>
            <FeatureSection/>
            <FeatureSection2/>
            <Community/>
            <FeatureSection3/>
            <Footer/>
        </div>
    )
}
