/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Shipment } from "@/lib/types";
import { updateShipment, deleteShipment } from "@/lib/api";

interface Props {
  shipments: Shipment[];
  onUpdate?: () => void; 
}

export default function ShipmentTable({ shipments, onUpdate }: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, status: Shipment["status"]) => {
    try {
      setUpdatingId(id);
      await updateShipment(id, { status });
      toast.success("Shipment updated successfully!");
      if (onUpdate) onUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update shipment");
    } finally {
      setUpdatingId(null);
    }
  };

  // delete shipments manage
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
      try {
        await deleteShipment(id);
        toast.success("Shipment deleted successfully!");
        if (onUpdate) onUpdate();
      } catch (error) {
        toast.error("Failed to delete shipment");
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tracking Number</TableHead>
          <TableHead>Carrier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((shipment) => (
          <TableRow key={shipment.id}>
            <TableCell>{shipment.tracking_number}</TableCell>
            <TableCell>{shipment.carrier}</TableCell>
            <TableCell>
              <Select
                value={shipment.status}
                onValueChange={(value) =>
                  handleUpdate(shipment.id, value as Shipment["status"])
                }
                disabled={updatingId === shipment.id}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue>
                    <Badge
                      variant={
                        shipment.status === "delivered"
                          ? "success"
                          : shipment.status === "failed"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {shipment.status.replace("_", " ")}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {new Date(shipment.created_at * 1000).toLocaleString()}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(shipment.id)}
                disabled={updatingId === shipment.id}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}