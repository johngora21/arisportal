from fastapi import APIRouter, HTTPException, UploadFile, File
import uuid
import os
import shutil
from pathlib import Path

router = APIRouter()

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file"""
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL path
        return {"url": f"/uploads/{unique_filename}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

@router.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file"""
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'mp4'
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL path
        return {"url": f"/uploads/{unique_filename}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading video: {str(e)}")
