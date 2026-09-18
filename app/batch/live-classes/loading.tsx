import { BatchLoadingState } from "../_components/batch-loading-state";

export default function LiveClassesLoading() {
    return <BatchLoadingState message="Loading your live classes schedule..." variant="dashboard" />;
}
