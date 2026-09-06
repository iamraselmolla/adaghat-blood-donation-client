export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

// Simplified sample; extend with full dataset as needed.
export const BD_DISTRICTS: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Comilla", "Feni"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Sirajganj"],
  Barishal: ["Barishal", "Patuakhali", "Bhola"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona"],
};

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
