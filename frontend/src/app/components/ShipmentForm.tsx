"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createShipment } from "@/lib/api";

//Validation schema
const shipmentSchema = z.object({
  tracking_number: z.string().min(5, "Tracking number must be at least 5 characters"),
  carrier: z.enum(["FedEx", "DHL"]),
});

export default function ShipmentForm() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState<"FedEx" | "DHL">("FedEx");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //Create, validation and submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = shipmentSchema.safeParse({ tracking_number: trackingNumber, carrier });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        tracking_number: fieldErrors.tracking_number?.[0] || "",
        carrier: fieldErrors.carrier?.[0] || "",
      });
      return;
    }

    try {
      await createShipment({ tracking_number: trackingNumber, carrier });
      toast.success("Shipment created successfully!", {
        description: "Your shipment has been added.",
      });
      setTrackingNumber("");
      setErrors({});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Failed to create shipment", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Input
          placeholder="Tracking Number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        {errors.tracking_number && (
          <p className="text-red-500 text-sm">{errors.tracking_number}</p>
        )}
      </div>
      <div>
        <Select
          onValueChange={(value) => setCarrier(value as "FedEx" | "DHL")}
          defaultValue="FedEx"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FedEx">FedEx</SelectItem>
            <SelectItem value="DHL">DHL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Create Shipment</Button>
    </form>
  );
}