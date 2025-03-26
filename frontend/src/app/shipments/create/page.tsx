"use client";

import ShipmentForm from "@/app/components/ShipmentForm";

export default function CreateShipmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Shipment</h1>
      <ShipmentForm />
    </div>
  );
}