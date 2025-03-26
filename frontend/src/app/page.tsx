"use client";

import { useEffect, useState } from "react";
import DashboardMetrics from "@/app/components/DashboardMetrics";
import ShipmentTable from "@/app/components/ShipmentTable";
import CarrierChart from "@/app/components/CarrierChart";
import { getMetrics, getShipments } from "@/lib/api";
import { Metrics, Shipment } from "@/lib/types";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  //fetch metrics and shipments data
  const fetchData = async () => {
    try {
      const [metricsData, shipmentsData] = await Promise.all([
        getMetrics(),
        getShipments(),
      ]);
      setMetrics(metricsData);
      setShipments(shipmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // Dashbord
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {metrics && <DashboardMetrics metrics={metrics} />}
      <ShipmentTable shipments={shipments} onUpdate={fetchData} />
      {metrics && <CarrierChart metrics={metrics} />}
    </div>
  );
}