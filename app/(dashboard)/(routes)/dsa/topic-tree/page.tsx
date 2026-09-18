"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, BarChart, ArrowRight, PlayCircle, ExternalLink, Maximize, Minimize } from "lucide-react";

import { dsaModules, DSATopicModule, getGradientForTopic } from "@/config/dsa-catalog";
import { hydrateModulesWithBatchResponse, BatchTopicResponse } from "@/lib/courseCatalogSync";
import { fetchBatchTopicDetails, TARGET_DSA_COURSE_ID } from "@/lib/courses";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useSidebar } from "@/app/(dashboard)/_components/sidebar/sidebar-context";
import supabase from "@/supabase";

const BRANCHES = [
  { id: "foundations", title: "Fundamentals", desc: "Core concepts & problem-solving basics", color: "from-blue-500 to-indigo-600", dotColor: "bg-blue-500" },
  { id: "ds", title: "Data Structures", desc: "Building blocks of memory and data", color: "from-emerald-500 to-teal-600", dotColor: "bg-emerald-500" },
  { id: "algo", title: "Algorithms", desc: "Advanced patterns & optimization", color: "from-amber-500 to-orange-600", dotColor: "bg-amber-500" }
];

export default function DSATopicTreePage() {
  const [batchData, setBatchData] = useState<BatchTopicResponse | null>(null);
  const [selectedModule, setSelectedModule] = useState<DSATopicModule | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { setCollapsed } = useSidebar();

  useEffect(() => {
    // Auto-collapse sidebar to maximize tree space on initial load
    setCollapsed(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadBatchDetails() {
      try {
        const topicIds = dsaModules.map((m) => m.id);
        const data = await fetchBatchTopicDetails(TARGET_DSA_COURSE_ID, topicIds);
        if (isMounted && data) {
          setBatchData(data);
        }
      } catch (err) {
        console.warn("Batch topic details endpoint unavailable:", err);
      }
    }
    loadBatchDetails();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadBatchDetails();
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const hydratedModules = useMemo(
    () => hydrateModulesWithBatchResponse(dsaModules, batchData),
    [batchData]
  );

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-[100] bg-background overflow-y-auto pb-32" 
    : "min-h-screen bg-background relative overflow-hidden pb-32";

  return (
    <div className={containerClasses}>
      {/* Premium Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-10 relative z-10">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            {!isFullscreen && (
              <Link href="/dsa" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group">
                <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                Back to DSA Catalog
              </Link>
            )}
            <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight mb-3">
              DSA <span className="text-blue-500">Topic Tree</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-2xl">
              A structured roadmap to mastering Data Structures and Algorithms. Follow the branches from core fundamentals down to advanced optimization techniques.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="shrink-0 gap-2 font-bold shadow-2xs"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          </Button>
        </div>

        {/* Tree Container */}
        <div className="relative border border-border/50 rounded-3xl bg-card/10 backdrop-blur-sm shadow-inner overflow-hidden">
          
          {/* =========================================
              DESKTOP VIEW (Top-to-Bottom Vertical Tree)
              ========================================= */}
          <div 
            className="hidden md:flex flex-col w-full overflow-auto py-16 px-12 items-center min-h-[600px] select-none scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Root Node */}
            <div className="flex flex-col items-center relative z-20">
               <div className="w-64 h-20 bg-card border border-border/80 shadow-xl rounded-2xl flex flex-col items-center justify-center relative z-20">
                  <h2 className="font-black text-xl text-foreground tracking-tight">DSA Topic Tree</h2>
                  <Badge variant="secondary" className="mt-1 font-bold">Full Curriculum</Badge>
               </div>
               {/* Connector Down */}
               <div className="w-[2px] h-10 bg-border/80" />
            </div>

            {/* Branches Container */}
            <div className="flex flex-row gap-12 lg:gap-20 xl:gap-32 relative">
               
               {/* Branches */}
               {BRANCHES.map((branch, bIdx) => {
                  const branchModules = hydratedModules.filter(m => m.category === branch.id);
                  if (branchModules.length === 0) return null;

                  return (
                     <div key={branch.id} className="flex flex-col items-center relative min-w-[260px] lg:min-w-[280px]">
                        
                        {/* Horizontal Spine Segment */}
                        {BRANCHES.length > 1 && (
                           <>
                             {bIdx === 0 && <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-border/80" />}
                             {bIdx === BRANCHES.length - 1 && <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-border/80" />}
                             {bIdx > 0 && bIdx < BRANCHES.length - 1 && <div className="absolute top-0 left-0 w-full h-[2px] bg-border/80" />}
                           </>
                        )}

                        {/* Connector Down to Branch Node */}
                        <div className="w-[2px] h-8 bg-border/80" />

                        {/* Branch Node */}
                        <div className={`w-full bg-gradient-to-br ${branch.color} p-[1px] rounded-2xl shadow-xl shrink-0 relative z-20 hover:scale-[1.02] transition-transform`}>
                           <div className="bg-background/95 backdrop-blur-sm p-4 rounded-2xl h-full flex flex-col items-center justify-center text-center min-h-[6.5rem]">
                              <h3 className="font-black text-lg text-foreground">{branch.title}</h3>
                              <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{branch.desc}</p>
                           </div>
                        </div>

                        {/* Modules Spine & Container */}
                        <div className="flex flex-col items-center relative mt-0 pt-8 w-full">
                           {/* Vertical Spine for Modules */}
                           {branchModules.length > 0 && (
                              <div className="absolute top-0 bottom-12 w-[2px] bg-border/80 z-0" />
                           )}

                           {branchModules.map((module, mIdx) => {
                              const Icon = module.icon || BookOpen;
                              const gradient = getGradientForTopic(module, mIdx);

                              return (
                                 <div key={module.id} className="w-full max-w-[240px] lg:max-w-[260px] mb-8 relative z-10 group cursor-pointer" onClick={() => setSelectedModule(module)}>
                                    
                                    {/* Module Node */}
                                    <div className="w-full bg-card border border-border/80 hover:border-primary/50 shadow-md p-4 rounded-xl transition-transform duration-300 group-hover:-translate-y-1 relative overflow-hidden">
                                       <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                       <div className="flex flex-col items-center text-center gap-3 relative z-10">
                                         <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient} text-white shadow-inner`}>
                                           <Icon className="w-5 h-5" />
                                         </div>
                                         <div className="flex flex-col items-center w-full">
                                           <h4 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">{module.title}</h4>
                                           <div className="flex items-center justify-between w-full mt-2.5">
                                             <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ${
                                               module.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                               module.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                               'bg-red-500/10 text-red-600 dark:text-red-400'
                                             }`}>{module.difficulty}</span>

                                             {!module.isUpcoming ? (
                                                <div className="flex items-center gap-1.5 ml-2 w-full max-w-[80px]">
                                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                     <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, module.progressPercent ?? 0))}%` }} />
                                                  </div>
                                                  <span className="text-[9px] font-bold text-primary shrink-0">{module.progressPercent ?? 0}%</span>
                                                </div>
                                             ) : (
                                                <span className="text-[9px] font-bold text-muted-foreground ml-2">Soon</span>
                                             )}
                                           </div>
                                         </div>
                                       </div>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  )
               })}
            </div>
          </div>


          {/* =========================================
              MOBILE VIEW (Vertical Trunk Tree)
              ========================================= */}
          <div className="md:hidden relative py-8 px-4">
            {/* Central Trunk Line */}
            <div className="absolute left-[31px] top-10 bottom-10 w-[2px] bg-border/60" />
            
            <div className="space-y-12">
              {BRANCHES.map((branch) => {
                const branchModules = hydratedModules.filter(m => m.category === branch.id);
                if (branchModules.length === 0) return null;
                
                return (
                  <div key={branch.id} className="relative">
                    
                    {/* Branch Header Row */}
                    <div className="relative flex flex-row items-center w-full mb-8 group">
                      {/* Node Dot */}
                      <div className={`absolute left-[12px] w-5 h-5 rounded-full ${branch.dotColor} shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 border-4 border-background`} />

                      {/* Branch Node */}
                      <div className="ml-12 w-[calc(100%-3rem)]">
                        <div className={`bg-gradient-to-br ${branch.color} p-[1px] rounded-2xl shadow-xl w-full z-20`}>
                          <div className="bg-background/95 backdrop-blur-sm p-4 rounded-2xl h-full flex flex-col justify-center">
                            <h2 className="text-lg font-black text-foreground">{branch.title}</h2>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{branch.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modules for this Branch */}
                    <div className="space-y-6">
                      {branchModules.map((module, idx) => {
                        const gradient = getGradientForTopic(module, idx);
                        const Icon = module.icon || BookOpen;

                        return (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            key={module.id} 
                            className="relative flex flex-row items-center w-full group cursor-pointer"
                            onClick={() => setSelectedModule(module)}
                          >
                            {/* Branch connector */}
                            <div className="absolute left-[32px] w-8 h-[2px] bg-border/50 group-hover:bg-primary/50 transition-colors z-0" />
                            
                            {/* Node Dot */}
                            <div className="absolute left-[29.5px] w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors z-10 border border-background" />

                            {/* Module Node */}
                            <div className="ml-12 w-[calc(100%-3rem)] relative z-20">
                              <div className="rounded-xl border border-border/80 bg-card hover:border-primary/50 shadow-sm p-3 relative overflow-hidden transition-colors">
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                <div className="flex items-center gap-3 relative z-10">
                                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient} text-white shadow-inner`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                      {module.title}
                                    </h3>
                                    <div className="flex items-center justify-between w-full mt-2">
                                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ${
                                        module.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                        module.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                        'bg-red-500/10 text-red-600 dark:text-red-400'
                                      }`}>
                                        {module.difficulty}
                                      </span>
                                      
                                      {!module.isUpcoming ? (
                                         <div className="flex items-center gap-1.5 ml-2 w-full max-w-[80px]">
                                           <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, module.progressPercent ?? 0))}%` }} />
                                           </div>
                                           <span className="text-[9px] font-bold text-primary shrink-0">{module.progressPercent ?? 0}%</span>
                                         </div>
                                      ) : (
                                         <span className="text-[9px] font-bold text-muted-foreground ml-2">Soon</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sheet for Module Details */}
      <Sheet open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
        <SheetContent className="w-full sm:max-w-md border-l border-border/50 bg-background/95 backdrop-blur-xl p-0 flex flex-col z-[110]">
          {selectedModule && (
            <>
              <div className={`h-32 w-full bg-gradient-to-br ${getGradientForTopic(selectedModule, 0)} relative overflow-hidden shrink-0`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-6 flex items-center gap-3 text-white">
                  {selectedModule.icon && <selectedModule.icon className="w-8 h-8" />}
                  <div>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none mb-1 text-[10px] uppercase font-black tracking-wider">
                      {selectedModule.categoryLabel}
                    </Badge>
                    <SheetTitle className="text-white text-xl font-black">{selectedModule.title}</SheetTitle>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                  <h4 className="text-sm font-extrabold text-foreground mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" /> Overview
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {selectedModule.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-1.5">
                    <BarChart className="w-4 h-4 text-primary" /> Key Topics Covered
                  </h4>
                  <ul className="space-y-2">
                    {selectedModule.topics.map((topic, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-foreground bg-muted/50 p-2.5 rounded-lg border border-border/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card/50 shrink-0 mt-auto">
                <Button className="w-full font-bold shadow-md h-12 text-sm gap-2" asChild>
                  <Link href={`/dsa/${selectedModule.id}`}>
                    Start Learning <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
