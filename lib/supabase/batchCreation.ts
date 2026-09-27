import { createClient } from "@/lib/supabase/client";

export type CreatedBatch = {
  id: string;
  batch_code: string;
  production_date: string;
  quantity: number | null;
  unit: string | null;
};

export async function createBatchAutomatically(input: {
  productionRunId: string;
  productionDate?: string;
  useByDate?: string | null;
  notes?: string | null;
}): Promise<CreatedBatch> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_production_batch_auto", {
    p_production_run_id: input.productionRunId,
    p_production_date:
      input.productionDate ?? new Date().toISOString().slice(0, 10),
    p_use_by_date: input.useByDate ?? null,
    p_notes: input.notes ?? null,
  });

  if (error) throw error;

  return data as CreatedBatch;
}
