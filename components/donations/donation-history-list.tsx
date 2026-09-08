"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, User, Phone, Loader2 } from "lucide-react";
import { donationService } from "@/lib/services/donation.service";
import { formatDate } from "@/lib/utils";

export function DonationHistoryList({ donorId }: { donorId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["donations", "by-donor", donorId],
    queryFn: () => donationService.listByDonor(donorId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground text-sm gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading history...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No donation history yet.</p>;
  }

  return (
    <div className="space-y-2">
      {data.map((record) => (
        <div key={record._id} className="rounded-xl bg-muted/40 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">{formatDate(record.donationDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 shrink-0" /> {record.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <User className="h-3 w-3 shrink-0" /> Given to {record.recipientName}
          </div>
          {record.requestedByName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Phone className="h-3 w-3 shrink-0" />
              Requested by {record.requestedByName}
              {record.requestedByPhone ? ` · ${record.requestedByPhone}` : ""}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
