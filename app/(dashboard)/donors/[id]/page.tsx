"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Deep-linking to a single donor simply opens the donors list;
// DonorsPage's modal can be extended to read this param if needed.
export default function DonorDetailRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/donors?highlight=${params.id}`);
  }, [router, params.id]);

  return null;
}
