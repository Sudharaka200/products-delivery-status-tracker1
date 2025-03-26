from fastapi import FastAPI, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional
import uuid
import time
import asyncio
import random
from contextlib import asynccontextmanager
import threading

#Data Model
class Carrier(str, Enum):
    FEDEX = "FedEx"
    DHL = "DHL"

class ShipmentStatus(str, Enum):
    PENDING = "pending"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    FAILED = "failed"

class ShipmentCreate(BaseModel):
    tracking_number: str = Field(..., min_length=5, description="Unique tracking number")
    carrier: Carrier

class ShipmentUpdate(BaseModel):
    status: ShipmentStatus

class Shipment(ShipmentCreate):
    id: str
    status: ShipmentStatus
    created_at: float
    updated_at: float

class MetricsOut(BaseModel):
    total_shipments: int
    success_rate: float
    fedex_success: int
    dhl_success: int

# Memory
shipments_db = []
lock = threading.Lock()
CARRIER_SUCCESS_RATES = {
    Carrier.FEDEX: 0.85, 
    Carrier.DHL: 0.75 
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(simulate_carrier_updates())
    yield

app = FastAPI(
    title="Product Delivery Status Tracker",
    description="A simple logistics tracking API for FedEx and DHL",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_metrics() -> MetricsOut:
    with lock:
        total = len(shipments_db)
        if total == 0:
            return MetricsOut(
                total_shipments=0,
                success_rate=0.0,
                fedex_success=0,
                dhl_success=0
            )

        successes = {Carrier.FEDEX: 0, Carrier.DHL: 0}
        for shipment in shipments_db:
            if shipment.status == ShipmentStatus.DELIVERED:
                successes[shipment.carrier] += 1

        success_rate = (sum(successes.values()) / total) * 100 if total > 0 else 0.0
        return MetricsOut(
            total_shipments=total,
            success_rate=round(success_rate, 2),
            fedex_success=successes[Carrier.FEDEX],
            dhl_success=successes[Carrier.DHL]
        )

# Background update with 30 sec
async def simulate_carrier_updates():
    while True:
        await asyncio.sleep(30)  
        with lock:
            for shipment in shipments_db:
                if shipment.status in [ShipmentStatus.DELIVERED, ShipmentStatus.FAILED]:
                    continue

                if shipment.status == ShipmentStatus.PENDING:
                    if random.random() < 0.7:  
                        shipment.status = ShipmentStatus.IN_TRANSIT
                        shipment.updated_at = time.time()
                elif shipment.status == ShipmentStatus.IN_TRANSIT:
                    success_rate = CARRIER_SUCCESS_RATES[shipment.carrier]
                    if random.random() < success_rate:
                        shipment.status = ShipmentStatus.DELIVERED
                    else:
                        shipment.status = ShipmentStatus.FAILED
                    shipment.updated_at = time.time()

# APIs
@app.get("/shipments", response_model=List[Shipment])
def get_shipments():
    with lock:
        return shipments_db[:10] 

# create shipment
@app.post("/shipments", status_code=status.HTTP_201_CREATED, response_model=Shipment)
def create_shipment(shipment: ShipmentCreate):
    with lock:
        # Check duplicate tracking
        if any(s.tracking_number == shipment.tracking_number for s in shipments_db):
            raise HTTPException(status_code=400, detail="Tracking number already exists")
        
        new_shipment = Shipment(
            id=str(uuid.uuid4()),
            status=ShipmentStatus.PENDING,
            created_at=time.time(),
            updated_at=time.time(),
            **shipment.dict()
        )
        shipments_db.append(new_shipment)
    return new_shipment

# Shipment find by id
@app.get("/shipments/{shipment_id}", response_model=Shipment)
def get_shipment(shipment_id: str):
    with lock:
        shipment = next((s for s in shipments_db if s.id == shipment_id), None)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

# shipment find id and status
@app.put("/shipments/{shipment_id}/status", response_model=Shipment)
def update_shipment_status(shipment_id: str, update: ShipmentUpdate):
    with lock:
        shipment = next((s for s in shipments_db if s.id == shipment_id), None)
        if not shipment:
            raise HTTPException(status_code=404, detail="Shipment not found")
        shipment.status = update.status
        shipment.updated_at = time.time()
        return shipment
    
#delete shipment
@app.delete("/shipments/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(shipment_id: str):
    with lock:
        shipment = next((s for s in shipments_db if s.id == shipment_id), None)
        if not shipment:
            raise HTTPException(status_code=404, detail="Shipment not found")
        shipments_db.remove(shipment)
    return None

# carriers
@app.get("/carriers", response_model=List[str])
def get_carriers():
    return [carrier.value for carrier in Carrier]

# metrics
@app.get("/metrics", response_model=MetricsOut)
def get_metrics():
    return calculate_metrics()

#change port
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)