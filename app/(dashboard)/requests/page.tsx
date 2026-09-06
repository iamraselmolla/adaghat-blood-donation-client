"use client";

import { Card } from "@/components/ui/card";
import { Siren } from "lucide-react";

export default function RequestsPage() {
  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and broadcast urgent blood requests to matching donors.</p>
      </div>
      <Card className="p-12 flex flex-col items-center text-center gap-3">
        <Siren className="h-8 w-8 text-primary" />
        <p className="text-sm text-muted-foreground max-w-sm">
          Emergency request broadcasting connects to the <code>/api/v1/requests</code> endpoint — wire this up next
          alongside the notifications service.
        </p>
      </Card>
    </div>
  );
}
