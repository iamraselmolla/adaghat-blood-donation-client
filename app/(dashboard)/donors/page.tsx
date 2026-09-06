"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { Button } from "@/components/ui/button";
import { DonorFiltersBar } from "@/components/donors/donor-filters";
import { DonorTable } from "@/components/donors/donor-table";
import { DonorDetailModal } from "@/components/donors/donor-detail-modal";
import { DonorFormModal } from "@/components/donors/donor-form-modal";
import { Pagination } from "@/components/shared/pagination";
import { donorService } from "@/lib/services/donor.service";
import { usePermissions } from "@/hooks/use-permissions";
import { Donor, DonorFilters } from "@/types";

export default function DonorsPage() {
  const searchParams = useSearchParams();
  const { canCreateDonor } = usePermissions();
  const queryClient = useQueryClient();

  const [filters, setFilters] = React.useState<DonorFilters>({
    search: "",
    bloodGroup: "ALL",
    availability: "ALL",
    eligibility: "ALL",
    page: 1,
    limit: 10,
  });

  const debouncedSearch = useDebouncedValue(filters.search, 350);

  const { data, isLoading } = useQuery({
    queryKey: ["donors", { ...filters, search: debouncedSearch }],
    queryFn: () => donorService.list({ ...filters, search: debouncedSearch }),
  });

  const [selectedDonor, setSelectedDonor] = React.useState<Donor | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingDonor, setEditingDonor] = React.useState<Donor | null>(null);

  React.useEffect(() => {
    if (searchParams.get("action") === "add" && canCreateDonor) {
      setEditingDonor(null);
      setFormOpen(true);
    }
  }, [searchParams, canCreateDonor]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => donorService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  function handleView(donor: Donor) {
    setSelectedDonor(donor);
    setDetailOpen(true);
  }

  function handleEdit(donor: Donor) {
    setEditingDonor(donor);
    setDetailOpen(false);
    setFormOpen(true);
  }

  function handleDelete(donor: Donor) {
    if (confirm(`Remove ${donor.name} from donor records? This cannot be undone.`)) {
      deleteMutation.mutate(donor._id);
    }
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donor Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.total ?? 0} registered donors {deleteMutation.isPending && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
          </p>
        </div>
        {canCreateDonor && (
          <Button
            className="gap-2 w-full sm:w-auto"
            size="lg"
            onClick={() => {
              setEditingDonor(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Donor
          </Button>
        )}
      </div>

      <DonorFiltersBar filters={filters} onChange={setFilters} />

      <DonorTable
        donors={data?.data ?? []}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        />
      )}

      <DonorDetailModal donor={selectedDonor} open={detailOpen} onOpenChange={setDetailOpen} onEdit={handleEdit} />
      <DonorFormModal open={formOpen} onOpenChange={setFormOpen} donor={editingDonor} />
    </div>
  );
}
