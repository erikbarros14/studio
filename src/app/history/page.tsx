
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Run } from "@/lib/types";
import { RunHistoryList } from "@/components/history/RunHistoryList";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function HistoryPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRuns = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedRuns = localStorage.getItem("runs");
      if (storedRuns) {
        setRuns(JSON.parse(storedRuns));
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const handleDeleteRun = (id: string) => {
    if (typeof window !== "undefined") {
      const updatedRuns = runs.filter((run) => run.id !== id);
      setRuns(updatedRuns);
      localStorage.setItem("runs", JSON.stringify(updatedRuns));
      toast({
        title: "Run Deleted",
        description: "The selected run has been removed from your history.",
        duration: 3000,
      });
    }
  };

  const handleClearAllRuns = () => {
    if (typeof window !== "undefined") {
      setRuns([]);
      localStorage.removeItem("runs");
      toast({
        title: "All Runs Cleared",
        description: "Your run history is now empty.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-muted-foreground">Loading run history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary">Run History</h1>
        <div className="flex gap-2">
           <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tracker
            </Link>
          </Button>
          {runs.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" /> Clear All History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your run history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllRuns} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <RunHistoryList runs={runs} onDeleteRun={handleDeleteRun} />
    </div>
  );
}
