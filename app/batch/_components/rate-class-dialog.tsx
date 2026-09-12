"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import supabase from "@/supabase";

interface RateClassDialogProps {
    classItem: any;
    userEmail?: string;
    onRatingSubmitted?: () => void;
    trigger?: React.ReactNode;
}

export function RateClassDialog({ classItem, userEmail, onRatingSubmitted, trigger }: RateClassDialogProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const userEmailLower = userEmail?.trim().toLowerCase();
    const ratingsObj = classItem?.ratings || {};
    const hasRated = classItem?.has_user_rated || Boolean(
        userEmailLower && (
            (Array.isArray(ratingsObj.overall) && ratingsObj.overall.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
            (Array.isArray(ratingsObj.content) && ratingsObj.content.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower))
        )
    );

    if (hasRated) {
        return null;
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;

            const identifier = classItem?.id || classItem?.class_url_slug;
            const res = await fetch(`/api/live-classes/${identifier}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    overall: rating,
                    content: rating,
                    doubts: rating,
                    engagement: rating,
                    comment: comment.trim()
                })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to submit rating");
            } else {
                toast.success("Thank you for your rating! ⭐");
                setOpen(false);
                if (onRatingSubmitted) onRatingSubmitted();
            }
        } catch (err) {
            console.error("Error submitting rating:", err);
            toast.error("Failed to submit rating. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs text-amber-600 border-amber-300 hover:bg-amber-50">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Rate Class
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Rate this Lecture</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500">
                        {classItem?.class_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                    <div className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-semibold text-gray-600">Select your rating</span>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-125 transition-transform focus:outline-none"
                                >
                                    <Star
                                        className={`w-7 h-7 ${
                                            star <= rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-amber-700 mt-0.5">
                            {rating === 5 ? "Excellent (5 / 5)" : rating === 4 ? "Very Good (4 / 5)" : rating === 3 ? "Good (3 / 5)" : rating === 2 ? "Fair (2 / 5)" : "Needs Improvement (1 / 5)"}
                        </span>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="comment" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            Optional Feedback / Note
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder="Any thoughts or suggestions for the mentor..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={2}
                            className="text-xs"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={submitting} className="text-xs">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs"
                    >
                        {submitting ? "Submitting..." : "Submit Rating"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
