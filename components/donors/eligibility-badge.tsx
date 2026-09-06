import { Badge } from "@/components/ui/badge";
import { isEligibleByDate } from "@/lib/utils";
import { Donor } from "@/types";

export function EligibilityBadge({ donor }: { donor: Donor }) {
  const medicalStatus = donor.medicalRecord?.eligibilityStatus;
  const dateEligible = isEligibleByDate(donor.lastDonationDate);

  if (medicalStatus === "INELIGIBLE" || !dateEligible) {
    return <Badge variant="destructive">Ineligible</Badge>;
  }
  if (medicalStatus === "PENDING_REVIEW") {
    return <Badge variant="warning">Pending Review</Badge>;
  }
  return <Badge variant="success">Eligible</Badge>;
}
