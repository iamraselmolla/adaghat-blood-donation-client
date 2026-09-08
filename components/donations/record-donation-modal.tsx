"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Droplet } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DonorPicker } from "@/components/donations/donor-picker";
import { donationFormSchema, DonationFormValues } from "@/lib/schemas/donation-schema";
import { donationService } from "@/lib/services/donation.service";
import { daysUntilEligible, formatDate } from "@/lib/utils";
import { Donor } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedDonor?: Donor | null;
}

const today = () => new Date().toISOString().slice(0, 10);

export function RecordDonationModal({ open, onOpenChange, preselectedDonor }: Props) {
  const queryClient = useQueryClient();
  const [selectedDonor, setSelectedDonor] = React.useState<Donor | null>(preselectedDonor ?? null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: { donationDate: today() },
  });

  React.useEffect(() => {
    if (open) {
      setSelectedDonor(preselectedDonor ?? null);
      reset({ donationDate: today(), donorId: preselectedDonor?._id ?? "" });
    }
  }, [open, preselectedDonor, reset]);

  const mutation = useMutation({
    mutationFn: donationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      onOpenChange(false);
    },
  });

  function handleDonorSelect(donor: Donor) {
    setSelectedDonor(donor);
    setValue("donorId", donor._id, { shouldValidate: true });
  }

  const remainingDays = selectedDonor ? daysUntilEligible(selectedDonor.lastDonationDate) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-primary" /> Record Blood Donation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Donor</Label>
            <Controller
              name="donorId"
              control={control}
              render={() => <DonorPicker value={selectedDonor} onChange={handleDonorSelect} />}
            />
            {errors.donorId && <p className="text-xs text-destructive">{errors.donorId.message}</p>}
            {selectedDonor?.lastDonationDate && (
              <p className="text-xs text-muted-foreground">
                Last donated {formatDate(selectedDonor.lastDonationDate)}
                {remainingDays > 0 && (
                  <span className="text-destructive"> — not eligible for {remainingDays} more day(s)</span>
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Donation Date</Label>
            <Input type="date" max={today()} {...register("donationDate")} />
            {errors.donationDate && <p className="text-xs text-destructive">{errors.donationDate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="e.g. Dhaka Medical College Hospital" {...register("location")} />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Recipient / Patient Name</Label>
            <Input placeholder="Who received the blood" {...register("recipientName")} />
            {errors.recipientName && <p className="text-xs text-destructive">{errors.recipientName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Requested By (optional)</Label>
              <Input placeholder="Patient's attendant name" {...register("requestedByName")} />
            </div>
            <div className="space-y-1.5">
              <Label>Requester Phone (optional)</Label>
              <Input placeholder="+8801XXXXXXXXX" {...register("requestedByPhone")} />
              {errors.requestedByPhone && (
                <p className="text-xs text-destructive">{errors.requestedByPhone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Input placeholder="Any additional context" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending || remainingDays > 0} className="gap-2">
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Donation Record
            </Button>
          </DialogFooter>

          {mutation.isError && (
            <p className="text-xs text-destructive text-center">
              Could not save this record. Please check the details and try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
