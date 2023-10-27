'use client';

import BlogSection from "./blog-section";
import FeatureSection from "./feature-section";
import HeaderSection from "./header-section";
import TestimonialSection from "./testimonial-section";


export default function LandingPage() {

    return (
        <div>
            <HeaderSection/>
            <FeatureSection/>
            <TestimonialSection/>
            <BlogSection/>
        </div>
    )
}
