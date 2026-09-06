import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  password: z.string().min(6, "Minimum 6 characters").optional().or(z.literal("")),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dob: z.string().min(1, "Date of birth is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  upazila: z.string().min(1, "Upazila is required"),
  addressLine: z.string().optional(),
  lastDonationDate: z.string().optional().or(z.literal("")),
  availability: z.boolean().default(true),
});

export const medicalInfoSchema = z.object({
  weightKg: z.coerce.number().min(30, "Weight must be at least 30kg").max(250),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80"),
  hemoglobin: z.coerce.number().min(5).max(25),
  diabetes: z.boolean().default(false),
  hepatitis: z.boolean().default(false),
  hiv: z.boolean().default(false),
  heartDisease: z.boolean().default(false),
  recentSurgery: z.boolean().default(false),
  recentTattoo: z.boolean().default(false),
  currentMedications: z.string().optional(),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type MedicalInfoValues = z.infer<typeof medicalInfoSchema>;

export const donorFormSchema = personalInfoSchema.merge(medicalInfoSchema);
export type DonorFormValues = z.infer<typeof donorFormSchema>;
