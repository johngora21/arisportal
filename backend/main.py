
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db, Base, engine
from datetime import datetime
import os
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="ArisPortal API",
    description="Complete ArisPortal backend API",
    version="1.0.0"
)

# Configure CORS - MUST be before other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:3000", "http://localhost:3002", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global exception handler for unhandled exceptions (but not HTTPException which FastAPI handles)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler to ensure errors are logged and CORS headers included"""
    # Don't handle HTTPException - let FastAPI handle it with proper CORS
    if isinstance(exc, HTTPException):
        raise exc
    
    import traceback
    error_trace = traceback.format_exc()
    print(f"Unhandled exception in {request.url.path}: {str(exc)}")
    print(error_trace)
    
    # Return error with CORS headers
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "http://localhost:3002"),
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
)

# Mount static files for uploaded images and videos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Import all routers
from routers import properties, investments, finance, inventory, suppliers, crm, payroll, pools, upload, escrow, transaction, auth, profile, wise, cards, transfers, invoices

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
app.include_router(profile.router, prefix="/api/v1", tags=["Profile"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(wise.router, prefix="/api/v1/remittances", tags=["Remittances"])
app.include_router(cards.router, prefix="/api/v1/cards", tags=["Cards"])
app.include_router(transfers.router, prefix="/api/v1/transfers", tags=["Transfers"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["Invoices"])

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
