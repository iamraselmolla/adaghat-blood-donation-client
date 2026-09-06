"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DonorFilters } from "@/types";
import { BD_DISTRICTS, BD_DIVISIONS, BLOOD_GROUPS } from "@/lib/bd-locations";

interface Props {
  filters: DonorFilters;
  onChange: (filters: DonorFilters) => void;
}

export function DonorFiltersBar({ filters, onChange }: Props) {
  function update<K extends keyof DonorFilters>(key: K, value: DonorFilters[K]) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  const hasActiveFilters =
    filters.bloodGroup !== "ALL" ||
    filters.division ||
    filters.availability !== "ALL" ||
    filters.eligibility !== "ALL" ||
    !!filters.search;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or email..."
          className="pl-10 h-11"
          value={filters.search ?? ""}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap snap-x snap-proximity">
        <Select value={filters.bloodGroup ?? "ALL"} onValueChange={(v) => update("bloodGroup", v as any)}>
          <SelectTrigger className="w-[140px] shrink-0 snap-start h-9 text-xs">
            <SelectValue placeholder="Blood Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Groups</SelectItem>
            {BLOOD_GROUPS.map((bg) => (
              <SelectItem key={bg} value={bg}>
                {bg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.division ?? "ALL"} onValueChange={(v) => update("division", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[140px] shrink-0 snap-start h-9 text-xs">
            <SelectValue placeholder="Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Divisions</SelectItem>
            {BD_DIVISIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.division && (
          <Select value={filters.district ?? "ALL"} onValueChange={(v) => update("district", v === "ALL" ? undefined : v)}>
            <SelectTrigger className="w-[140px] shrink-0 snap-start h-9 text-xs">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Districts</SelectItem>
              {(BD_DISTRICTS[filters.division] ?? []).map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={filters.availability ?? "ALL"} onValueChange={(v) => update("availability", v as any)}>
          <SelectTrigger className="w-[140px] shrink-0 snap-start h-9 text-xs">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.eligibility ?? "ALL"} onValueChange={(v) => update("eligibility", v as any)}>
          <SelectTrigger className="w-[150px] shrink-0 snap-start h-9 text-xs">
            <SelectValue placeholder="Eligibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Any Eligibility</SelectItem>
            <SelectItem value="ELIGIBLE">Eligible</SelectItem>
            <SelectItem value="INELIGIBLE">Ineligible</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1 text-muted-foreground shrink-0"
            onClick={() =>
              onChange({ search: "", bloodGroup: "ALL", division: undefined, district: undefined, availability: "ALL", eligibility: "ALL", page: 1, limit: filters.limit })
            }
          >
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
