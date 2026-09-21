export type ProPlanId = "monthly" | "yearly" | "lifetime";

export interface ProSubscription {
  is_pro?: boolean;
  subscription_active_till_epoch?: number;
  plan_id?: string;
  order_id?: string;
  payment_id?: string;
  purchased_at_epoch?: number;
  [key: string]: any;
}

export interface ProStatusResult {
  isPro: boolean;
  isLoading: boolean;
  activeTillEpoch: number;
  isLifetime: boolean;
  subscription: ProSubscription | null;
  refresh: () => Promise<void>;
}
