"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Donor } from "@/types";
import { bloodGroupColor, daysUntilEligible, formatDate, getInitials } from "@/lib/utils";
import { EligibilityBadge } from "@/components/donors/eligibility-badge";
import { DonationHistoryList } from "@/components/donations/donation-history-list";
import { RecordDonationModal } from "@/components/donations/record-donation-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { Mail, MapPin, Phone, Pencil, Calendar, Droplet, HeartHandshake } from "lucide-react";

interface Props {
  donor: Donor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (donor: Donor) => void;
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

const conditionLabels: Record<string, string> = {
  diabetes: "Diabetes",
  hepatitis: "Hepatitis",
  hiv: "HIV",
  heartDisease: "Heart Disease",
  recentSurgery: "Recent Surgery",
  recentTattoo: "Tattoo (last 6 months)",
};

export function DonorDetailModal({ donor, open, onOpenChange, onEdit }: Props) {
  const { canEditDonor, isReadOnly } = usePermissions();
  const [recordOpen, setRecordOpen] = React.useState(false);
  if (!donor) return null;

  const mr = donor.medicalRecord;
  const flaggedConditions = mr
    ? Object.entries(mr.conditions).filter(([, v]) => v).map(([k]) => conditionLabels[k])
    : [];
  const remainingDays = daysUntilEligible(donor.lastDonationDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">{getInitials(donor.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{donor.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={bloodGroupColor(donor.bloodGroup)} variant="outline">
                  <Droplet className="h-3 w-3 mr-1" />
                  {donor.bloodGroup}
                </Badge>
                <EligibilityBadge donor={donor} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-1 border-t border-border/60 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">Personal Info</p>
          <InfoRow icon={Phone} label="Phone" value={donor.phone} />
          {donor.email && <InfoRow icon={Mail} label="Email" value={donor.email} />}
          <InfoRow
            icon={MapPin}
            label="Address"
            value={`${donor.address.upazila}, ${donor.address.district}, ${donor.address.division}`}
          />
          <InfoRow icon={Calendar} label="Last Donation" value={formatDate(donor.lastDonationDate)} />
        </div>

        {mr && (
          <div className="space-y-1 border-t border-border/60 pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">
              Medical History
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm py-2">
              <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="font-semibold">{mr.weightKg} kg</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-muted-foreground">BP</p>
                <p className="font-semibold">{mr.bloodPressure}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-muted-foreground">Hemoglobin</p>
                <p className="font-semibold">{mr.hemoglobin} g/dL</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-1.5">Conditions & Flags</p>
            <div className="flex flex-wrap gap-1.5">
              {flaggedConditions.length > 0 ? (
                flaggedConditions.map((c) => (
                  <Badge key={c} variant="destructive">
                    {c}
                  </Badge>
                ))
              ) : (
                <Badge variant="success">No conditions reported</Badge>
              )}
            </div>

            {mr.currentMedications && (
              <p className="text-sm mt-2">
                <span className="text-muted-foreground">Medications: </span>
                {mr.currentMedications}
              </p>
            )}
          </div>
        )}

        <div className="space-y-1 border-t border-border/60 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2 mb-2">
            Donation History
          </p>
          <DonationHistoryList donorId={donor._id} />
        </div>

        {canEditDonor && (
          <DialogFooter className="flex-row-reverse sm:flex-row">
            <Button variant="outline" onClick={() => onEdit(donor)} className="gap-2">
              <Pencil className="h-4 w-4" /> Edit Donor
            </Button>
            <Button
              onClick={() => setRecordOpen(true)}
              disabled={remainingDays > 0}
              className="gap-2"
              title={remainingDays > 0 ? `Not eligible for ${remainingDays} more day(s)` : undefined}
            >
              <HeartHandshake className="h-4 w-4" /> Record Donation
            </Button>
          </DialogFooter>
        )}
      </DialogContent>

      <RecordDonationModal open={recordOpen} onOpenChange={setRecordOpen} preselectedDonor={donor} />
    </Dialog>
  );
}
