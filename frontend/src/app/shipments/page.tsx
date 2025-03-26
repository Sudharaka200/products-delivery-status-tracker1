"use client";

import { useEffect, useState } from "react";
import ShipmentTable from "@/app/components/ShipmentTable";
import { getShipments } from "@/lib/api";
import { Shipment } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [carrierFilter, setCarrierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchShipments = () => {
    getShipments().then(setShipments).catch(console.error);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  //filter shipments
  const filteredShipments = shipments.filter((s) => {
    return (
      (carrierFilter === "all" || s.carrier === carrierFilter) &&
      (statusFilter === "all" || s.status === statusFilter)
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shipments</h1>
      <div className="flex space-x-4">
        <Select onValueChange={setCarrierFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Carriers</SelectItem>
            <SelectItem value="FedEx">FedEx</SelectItem>
            <SelectItem value="DHL">DHL</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ShipmentTable shipments={filteredShipments} onUpdate={fetchShipments} />
    </div>
  );
}