"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/lib/services/auth.service";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  identifier: z.string().min(3, "Email or phone required"),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.enum(["ADMIN", "MEMBER"]),
});
type FormValues = z.infer<typeof schema>;

export function AddStaffModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: "MEMBER" } });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => authService.registerStaff(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      reset();
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Admin or Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input {...register("name")} placeholder="John Smith" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Email or Phone</Label>
            <Input {...register("identifier")} placeholder="john@example.com" />
            {errors.identifier && <p className="text-xs text-destructive">{errors.identifier.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Temporary Password</Label>
            <Input type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={watch("role")} onValueChange={(v) => setValue("role", v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin (Full donor management)</SelectItem>
                <SelectItem value="MEMBER">Member (Read-only viewer)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending} className="gap-2">
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
