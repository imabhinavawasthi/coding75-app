import React from "react";
import { Search, X, Layers, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SheetToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandAll: boolean;
  handleExpandAll: () => void;
  filteredTopicsLength: number;
  onDownloadPDF?: () => void;
}

export const SheetToolbar: React.FC<SheetToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  expandAll,
  handleExpandAll,
  filteredTopicsLength,
  onDownloadPDF,
}) => {
  return (
    <>
      {/* Toolbar: Search + Expand All */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, patterns, or problems..."
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Expand/Collapse All */}
        <button
          onClick={handleExpandAll}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shrink-0"
        >
          <Layers size={14} />
          <span className="hidden sm:inline">{expandAll ? "Collapse All" : "Expand All"}</span>
        </button>

        {/* Download PDF */}
        {onDownloadPDF && (
          <button
            onClick={onDownloadPDF}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors shrink-0"
            title="Download Sheet as PDF"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download Sheet</span>
          </button>
        )}
      </motion.div>

      {/* Search results info */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTopicsLength > 0 ? (
                <>
                  Found results in{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {filteredTopicsLength}
                  </span>{" "}
                  topic{filteredTopicsLength > 1 ? "s" : ""} for &quot;
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {searchQuery}
                  </span>
                  &quot;
                </>
              ) : (
                <>
                  No results for &quot;
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {searchQuery}
                  </span>
                  &quot;
                </>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
