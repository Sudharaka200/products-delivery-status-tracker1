export interface Shipment {
  id: string;
  tracking_number: string;
  carrier: "FedEx" | "DHL";
  status: "pending" | "in_transit" | "delivered" | "failed";
  created_at: number;
  updated_at: number;
}

export interface ShipmentCreate {
  tracking_number: string;
  carrier: "FedEx" | "DHL";
}

export interface ShipmentUpdate {
  status: "pending" | "in_transit" | "delivered" | "failed"; // Extend if more fields are updatable
}

export interface Metrics {
  total_shipments: number;
  success_rate: number;
  fedex_success: number;
  dhl_success: number;
}