import CommunityHeader from "./_components/community-header";
import Features from "./_components/features";
import Pricing from "./_components/pricing";

const CommunityPage = () => {
  return (
    <div className="bg-white scroll-smooth">
      <div id="header">
        <CommunityHeader />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
    </div>
  );
}

export default CommunityPage;