import axios from "axios";
import { Metrics, Shipment, ShipmentCreate, ShipmentUpdate } from "./types";

const API_URL = "http://localhost:8000";

// Get shipments
export async function getShipments(): Promise<Shipment[]> {
  const response = await axios.get(`${API_URL}/shipments`);
  return response.data;
}

// Get shipment by id
export async function getShipment(id: string): Promise<Shipment> {
  const response = await axios.get(`${API_URL}/shipments/${id}`);
  return response.data;
}

// Create shipments
export async function createShipment(data: ShipmentCreate): Promise<Shipment> {
  const response = await axios.post(`${API_URL}/shipments`, data);
  return response.data;
}

// Update shipments
export async function updateShipment(id: string, data: ShipmentUpdate): Promise<Shipment> {
  const response = await axios.put(`${API_URL}/shipments/${id}/status`, data);
  return response.data;
}

// Delete shipments
export async function deleteShipment(id: string): Promise<void> {
  await axios.delete(`${API_URL}/shipments/${id}`);
}

//Get Metrics
export async function getMetrics(): Promise<Metrics> {
  const response = await axios.get(`${API_URL}/metrics`);
  return response.data;
}