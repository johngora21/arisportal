from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import get_db, Base, engine
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="ArisPortal API",
    description="Complete ArisPortal backend API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded images and videos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Import all routers
from routers import properties, investments, finance, inventory, suppliers, crm, payroll, pools, upload, escrow, transaction

# Include all routers
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(properties.router, prefix="/api/v1/properties", tags=["Properties"])
app.include_router(investments.router, prefix="/api/v1/investments", tags=["Investments"])
app.include_router(finance.router, prefix="/api/v1/finance", tags=["Finance"])
app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(suppliers.router, prefix="/api/v1/suppliers", tags=["Suppliers"])
app.include_router(pools.router, prefix="/api/v1", tags=["Pools"])
app.include_router(upload.router, prefix="/api/v1", tags=["Upload"])
app.include_router(crm.router, prefix="/api/v1", tags=["CRM"])
app.include_router(payroll.router, prefix="/api/v1/payroll", tags=["Payroll"])
app.include_router(escrow.router, prefix="/api/v1/escrow", tags=["Escrow"])
app.include_router(transaction.router, prefix="/api/v1/transactions", tags=["Transactions"])

# Create database tables
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db = next(get_db())
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db.close()
        database_status = "connected"
    except Exception as e:
        database_status = f"disconnected: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": database_status
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ArisPortal API",
        "version": "1.0.0",
        "framework": "FastAPI"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4001)
