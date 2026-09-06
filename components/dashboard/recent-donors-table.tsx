"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { donorService } from "@/lib/services/donor.service";
import { bloodGroupColor, formatDate, getInitials } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function RecentDonorsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["donors", "recent"],
    queryFn: () => donorService.list({ page: 1, limit: 6 }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Donors</CardTitle>
        <Link href="/donors">
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-muted/30 mx-5 my-2 rounded-lg" />
            ))}

          {data?.data.map((donor) => (
            <Link
              key={donor._id}
              href={`/donors/${donor._id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-accent/40 transition-colors"
            >
              <Avatar>
                <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{donor.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {donor.address.district}, {donor.address.division} · Last donated {formatDate(donor.lastDonationDate)}
                </p>
              </div>
              <Badge className={bloodGroupColor(donor.bloodGroup)} variant="outline">
                {donor.bloodGroup}
              </Badge>
              <Badge variant={donor.availability ? "success" : "outline"}>
                {donor.availability ? "Available" : "Unavailable"}
              </Badge>
            </Link>
          ))}

          {!isLoading && data?.data.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No donors yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
