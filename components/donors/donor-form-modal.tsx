"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight, Save } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormStepper } from "@/components/donors/form-stepper";
import { donorFormSchema, DonorFormValues } from "@/lib/schemas/donor-schema";
import { donorService } from "@/lib/services/donor.service";
import { BD_DISTRICTS, BD_DIVISIONS, BLOOD_GROUPS } from "@/lib/bd-locations";
import { Donor } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor?: Donor | null; // present = edit mode
}

const STEPS = ["Personal Info", "Medical History"];

const conditionFields = [
  { key: "diabetes", label: "Diabetes" },
  { key: "hepatitis", label: "Hepatitis" },
  { key: "hiv", label: "HIV" },
  { key: "heartDisease", label: "Heart Disease" },
  { key: "recentSurgery", label: "Surgery (last 6 months)" },
  { key: "recentTattoo", label: "Tattoo (last 6 months)" },
] as const;

export function DonorFormModal({ open, onOpenChange, donor }: Props) {
  const queryClient = useQueryClient();
  const [step, setStep] = React.useState(0);
  const isEdit = !!donor;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      availability: true,
      diabetes: false,
      hepatitis: false,
      hiv: false,
      heartDisease: false,
      recentSurgery: false,
      recentTattoo: false,
    },
  });

  React.useEffect(() => {
    if (open) {
      setStep(0);
      if (donor) {
        reset({
          name: donor.name,
          phone: donor.phone,
          email: donor.email ?? "",
          bloodGroup: donor.bloodGroup,
          gender: donor.gender,
          dob: donor.dob?.slice(0, 10),
          division: donor.address.division,
          district: donor.address.district,
          upazila: donor.address.upazila,
          addressLine: donor.address.addressLine ?? "",
          lastDonationDate: donor.lastDonationDate?.slice(0, 10) ?? "",
          availability: donor.availability,
          weightKg: donor.medicalRecord?.weightKg ?? 0,
          bloodPressure: donor.medicalRecord?.bloodPressure ?? "",
          hemoglobin: donor.medicalRecord?.hemoglobin ?? 0,
          diabetes: donor.medicalRecord?.conditions.diabetes ?? false,
          hepatitis: donor.medicalRecord?.conditions.hepatitis ?? false,
          hiv: donor.medicalRecord?.conditions.hiv ?? false,
          heartDisease: donor.medicalRecord?.conditions.heartDisease ?? false,
          recentSurgery: donor.medicalRecord?.conditions.recentSurgery ?? false,
          recentTattoo: donor.medicalRecord?.conditions.recentTattoo ?? false,
          currentMedications: donor.medicalRecord?.currentMedications ?? "",
        });
      } else {
        reset({ availability: true, diabetes: false, hepatitis: false, hiv: false, heartDisease: false, recentSurgery: false, recentTattoo: false });
      }
    }
  }, [open, donor, reset]);

  const division = watch("division");

  const mutation = useMutation({
    mutationFn: async (values: DonorFormValues) => {
      const payload: Partial<Donor> = {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        bloodGroup: values.bloodGroup,
        gender: values.gender,
        dob: values.dob,
        address: {
          division: values.division,
          district: values.district,
          upazila: values.upazila,
          addressLine: values.addressLine,
        },
        lastDonationDate: values.lastDonationDate || null,
        availability: values.availability,
      };

      const savedDonor = isEdit ? await donorService.update(donor!._id, payload) : await donorService.create(payload);

      await donorService.updateMedicalRecord(savedDonor._id, {
        weightKg: values.weightKg,
        bloodPressure: values.bloodPressure,
        hemoglobin: values.hemoglobin,
        conditions: {
          diabetes: values.diabetes,
          hepatitis: values.hepatitis,
          hiv: values.hiv,
          heartDisease: values.heartDisease,
          recentSurgery: values.recentSurgery,
          recentTattoo: values.recentTattoo,
        },
        currentMedications: values.currentMedications,
      });

      return savedDonor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      onOpenChange(false);
    },
  });

  async function goNext() {
    const valid = await trigger([
      "name",
      "phone",
      "email",
      "bloodGroup",
      "gender",
      "dob",
      "division",
      "district",
      "upazila",
    ]);
    if (valid) setStep(1);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Donor" : "Add New Donor"}</DialogTitle>
        </DialogHeader>

        <FormStepper steps={STEPS} current={step} />

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label>Full Name</Label>
                  <Input {...register("name")} placeholder="Jane Doe" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input {...register("phone")} placeholder="+8801XXXXXXXXX" />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Email (optional)</Label>
                  <Input {...register("email")} placeholder="jane@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {!isEdit && (
                  <div className="space-y-1.5 col-span-2">
                    <Label>Password (for donor account login)</Label>
                    <Input type="password" {...register("password")} placeholder="••••••••" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Blood Group</Label>
                  <Select value={watch("bloodGroup")} onValueChange={(v) => setValue("bloodGroup", v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bloodGroup && <p className="text-xs text-destructive">Required</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select value={watch("gender")} onValueChange={(v) => setValue("gender", v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input type="date" {...register("dob")} />
                  {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Last Donation Date</Label>
                  <Input type="date" {...register("lastDonationDate")} />
                </div>

                <div className="space-y-1.5">
                  <Label>Division</Label>
                  <Select value={watch("division")} onValueChange={(v) => { setValue("division", v); setValue("district", ""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {BD_DIVISIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.division && <p className="text-xs text-destructive">Required</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>District</Label>
                  <Select value={watch("district")} onValueChange={(v) => setValue("district", v)} disabled={!division}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {(BD_DISTRICTS[division] ?? []).map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && <p className="text-xs text-destructive">Required</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Upazila</Label>
                  <Input {...register("upazila")} placeholder="e.g. Savar" />
                  {errors.upazila && <p className="text-xs text-destructive">{errors.upazila.message}</p>}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label>Address Line (optional)</Label>
                  <Input {...register("addressLine")} placeholder="House, road, area" />
                </div>

                <div className="flex items-center justify-between col-span-2 bg-muted/40 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Currently Available</p>
                    <p className="text-xs text-muted-foreground">Donor is open to donation requests</p>
                  </div>
                  <Switch checked={watch("availability")} onCheckedChange={(v) => setValue("availability", v)} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.1" {...register("weightKg")} />
                  {errors.weightKg && <p className="text-xs text-destructive">{errors.weightKg.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Blood Pressure</Label>
                  <Input placeholder="120/80" {...register("bloodPressure")} />
                  {errors.bloodPressure && <p className="text-xs text-destructive">{errors.bloodPressure.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Hemoglobin (g/dL)</Label>
                  <Input type="number" step="0.1" {...register("hemoglobin")} />
                  {errors.hemoglobin && <p className="text-xs text-destructive">{errors.hemoglobin.message}</p>}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Chronic Illnesses / Risk Flags</Label>
                <div className="grid grid-cols-2 gap-3">
                  {conditionFields.map((c) => (
                    <label key={c.key} className="flex items-center gap-2.5 bg-muted/40 rounded-xl px-3.5 py-2.5 cursor-pointer">
                      <Checkbox
                        checked={watch(c.key)}
                        onCheckedChange={(v) => setValue(c.key, !!v)}
                      />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Current Medications (optional)</Label>
                <Input {...register("currentMedications")} placeholder="e.g. Metformin 500mg" />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {step === 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            {step === 0 ? (
              <Button type="button" onClick={goNext} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={mutation.isPending} className="gap-2">
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEdit ? "Save Changes" : "Add Donor"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
