"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { donorService } from "@/lib/services/donor.service";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { bloodGroupColor, daysUntilEligible, getInitials, isEligibleByDate } from "@/lib/utils";
import { Donor } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: Donor | null;
  onChange: (donor: Donor) => void;
}

export function DonorPicker({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["donors", "picker", debouncedQuery],
    queryFn: () => donorService.list({ search: debouncedQuery, page: 1, limit: 20 }),
    enabled: open,
  });

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const donors = data?.data ?? [];
  const eligibleDonors = donors.filter((d) => isEligibleByDate(d.lastDonationDate));
  const ineligibleCount = donors.length - eligibleDonors.length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background/60 backdrop-blur-sm px-4 py-2 text-sm shadow-sm"
      >
        {value ? (
          <span className="flex items-center gap-2 truncate">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">{getInitials(value.name)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{value.name}</span>
            <Badge className={cn(bloodGroupColor(value.bloodGroup), "shrink-0")} variant="outline">
              {value.bloodGroup}
            </Badge>
          </span>
        ) : (
          <span className="text-muted-foreground">Search an eligible donor...</span>
        )}
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl shadow-glass-lg overflow-hidden">
          <div className="p-2 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Name, phone, or blood group..."
                className="pl-8 h-9 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading && <p className="text-center text-xs text-muted-foreground py-6">Searching...</p>}

            {!isLoading && eligibleDonors.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-6 px-4">
                No eligible donors found. Donors within the 3-month window are hidden.
              </p>
            )}

            {eligibleDonors.map((donor) => (
              <button
                key={donor._id}
                type="button"
                onClick={() => {
                  onChange(donor);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent/50 transition-colors text-left"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getInitials(donor.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{donor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {donor.phone} · {donor.address.district}
                  </p>
                </div>
                <Badge className={bloodGroupColor(donor.bloodGroup)} variant="outline">
                  {donor.bloodGroup}
                </Badge>
                {value?._id === donor._id && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>

          {ineligibleCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-t border-border/60 text-[11px] text-muted-foreground bg-muted/30">
              <Clock className="h-3 w-3" />
              {ineligibleCount} donor{ineligibleCount > 1 ? "s" : ""} hidden — within the 3-month donation window.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
