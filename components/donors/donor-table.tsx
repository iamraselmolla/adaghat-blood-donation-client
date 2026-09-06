"use client";

import { motion } from "framer-motion";
import { MoreVertical, Eye, Pencil, Trash2, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Donor } from "@/types";
import { bloodGroupColor, formatDate, getInitials } from "@/lib/utils";
import { EligibilityBadge } from "@/components/donors/eligibility-badge";
import { usePermissions } from "@/hooks/use-permissions";

interface Props {
  donors: Donor[];
  isLoading?: boolean;
  onView: (donor: Donor) => void;
  onEdit: (donor: Donor) => void;
  onDelete: (donor: Donor) => void;
}

export function DonorTable({ donors, isLoading, onView, onEdit, onDelete }: Props) {
  const { canEditDonor, canDeleteDonor } = usePermissions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <Card className="p-12 text-center text-sm text-muted-foreground">
        No donors match your filters.
      </Card>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <Card className="hidden md:block overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-5 py-3">Donor</th>
              <th className="text-left font-medium px-5 py-3">Blood Group</th>
              <th className="text-left font-medium px-5 py-3">Location</th>
              <th className="text-left font-medium px-5 py-3">Last Donation</th>
              <th className="text-left font-medium px-5 py-3">Availability</th>
              <th className="text-left font-medium px-5 py-3">Eligibility</th>
              <th className="text-right font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {donors.map((donor, i) => (
              <motion.tr
                key={donor._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => onView(donor)}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {donor.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge className={bloodGroupColor(donor.bloodGroup)} variant="outline">
                    {donor.bloodGroup}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {donor.address.district}, {donor.address.division}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(donor.lastDonationDate)}</td>
                <td className="px-5 py-3">
                  <Badge variant={donor.availability ? "success" : "outline"}>
                    {donor.availability ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <EligibilityBadge donor={donor} />
                </td>
                <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center ml-auto">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(donor)}>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      {canEditDonor && (
                        <DropdownMenuItem onClick={() => onEdit(donor)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit Donor
                        </DropdownMenuItem>
                      )}
                      {canDeleteDonor && (
                        <DropdownMenuItem onClick={() => onDelete(donor)} className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {donors.map((donor, i) => (
          <motion.div
            key={donor._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="p-4" onClick={() => onView(donor)}>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{donor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {donor.address.district}, {donor.address.division}
                  </p>
                </div>
                <Badge className={bloodGroupColor(donor.bloodGroup)} variant="outline">
                  {donor.bloodGroup}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={donor.availability ? "success" : "outline"} className="text-[10px]">
                  {donor.availability ? "Available" : "Unavailable"}
                </Badge>
                <EligibilityBadge donor={donor} />
                <span className="text-[11px] text-muted-foreground ml-auto">
                  Last: {formatDate(donor.lastDonationDate)}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
