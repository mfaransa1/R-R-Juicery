import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function subscribeToMyOrder(
  orderId: string,
  onChange: () => void
): RealtimeChannel {
  const supabase = createClient();

  return supabase
    .channel(`rr-order-${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      },
      () => {
        onChange();
      }
    )
    .subscribe();
}

export function unsubscribeFromOrder(channel: RealtimeChannel) {
  const supabase = createClient();
  void supabase.removeChannel(channel);
}
