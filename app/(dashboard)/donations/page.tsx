"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Droplets, MapPin, User, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/shared/pagination";
import { RecordDonationModal } from "@/components/donations/record-donation-modal";
import { donationService } from "@/lib/services/donation.service";
import { bloodGroupColor, formatDate, getInitials } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { usePermissions } from "@/hooks/use-permissions";

export default function DonationsPage() {
  const { canCreateDonor } = usePermissions(); // same admin-tier permission gates recording donations
  const [recordOpen, setRecordOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isLoading } = useQuery({
    queryKey: ["donations", { search: debouncedSearch, page }],
    queryFn: () => donationService.list({ search: debouncedSearch, page, limit: 10 }),
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donation Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every recorded donation — when, where, and who received it.
          </p>
        </div>
        {canCreateDonor && (
          <Button className="gap-2 w-full sm:w-auto" size="lg" onClick={() => setRecordOpen(true)}>
            <Plus className="h-4 w-4" /> Record Donation
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by donor, recipient, or location..."
          className="pl-10 h-11"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-24 animate-pulse bg-muted/40" />)}

        {!isLoading && data?.data.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">No donation records yet.</Card>
        )}

        {data?.data.map((record) => (
          <Card key={record._id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{getInitials(record.donorName ?? "?")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{record.donorName ?? "Unknown Donor"}</p>
                  {record.donorBloodGroup && (
                    <Badge className={bloodGroupColor(record.donorBloodGroup)} variant="outline">
                      {record.donorBloodGroup}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {formatDate(record.donationDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                  <MapPin className="h-3 w-3 shrink-0" /> {record.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <User className="h-3 w-3 shrink-0" /> Given to {record.recipientName}
                  {record.requestedByName && ` · Requested by ${record.requestedByName}`}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}

      <RecordDonationModal open={recordOpen} onOpenChange={setRecordOpen} />
    </div>
  );
}
