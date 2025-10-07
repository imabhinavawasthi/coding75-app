import MainBlock from "../(components)/main-block";
import ProductFeaturesGrid from "../(components)/product-features-grid";
import SalesTimer from "../(components)/sales-timer";

const ProductHome = () => {
    return (
        <div className="min-w-screen relative min-h-screen w-full overflow-hidden">
            {/* Fixed Banner */}
            <div className="fixed top-0 left-0 w-full z-50">
                <SalesTimer />
            </div>

            <div>
                <MainBlock />
            </div>
            
        </div>
    );
};

export default ProductHome;