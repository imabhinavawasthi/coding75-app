import ProductFeaturesGrid from "./product-features-grid"
import MainCard from "./main-card"
import { FeatureSteps } from "./feature-steps"

const features = [
    {
        step: 'Step 1',
        title: 'Learn the Basics',
        content: 'Start your Web3 journey by learning the basics of blockchain.',
        image: 'https://images.unsplash.com/photo-1723958929247-ef054b525153?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 2',
        title: 'Deep Dive',
        content: 'Dive deep into blockchain fundamentals and smart contract development.',
        image: 'https://images.unsplash.com/photo-1723931464622-b7df7c71e380?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 3',
        title: 'Build Projects',
        content: 'Graduate with hands-on Web3 experience through building decentralized applications.',
        image: 'https://images.unsplash.com/photo-1725961476494-efa87ae3106a?q=80&w=2070&auto=format&fit=crop'
    },
]

export default function MainBlock({
    image = null
}) {
    return (
        <div>
            <div className="relative z-10">
                <MainCard image={image} />
            </div>

            <div>
                <ProductFeaturesGrid />
            </div>

            <FeatureSteps
                features={features}
                title="Your Journey Starts Here"
                autoPlayInterval={4000}
                imageHeight="h-[500px] relative bottom-20"
            />

        </div>
    )
}
