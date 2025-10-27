# Real Estate API Documentation

This document provides comprehensive API documentation for the Real Estate module, covering all endpoints for Plots, Structures, Investments, My Listings, and My Properties.

## Base URL
```
http://localhost:4001/api/v1/real-estate
```

## Authentication
All endpoints require authentication. Include the user ID in the request body or as a parameter.

## API Endpoints

### 1. Properties (Plots & Structures)

#### Get All Properties
```http
GET /properties
```

**Query Parameters:**
- `search_term` (string, optional): Search in title, description, location
- `property_type` (enum, optional): plot, house, apartment, commercial, office, warehouse, shop
- `region` (string, optional): Filter by region
- `district` (string, optional): Filter by district
- `min_price` (float, optional): Minimum price filter
- `max_price` (float, optional): Maximum price filter
- `min_size` (float, optional): Minimum size filter
- `max_size` (float, optional): Maximum size filter
- `status` (enum, optional): available, sold, rented, pending, off_market
- `verification_status` (enum, optional): pending, approved, rejected, under_review
- `limit` (int, default: 20): Number of results per page
- `offset` (int, default: 0): Number of results to skip

**Response:**
```json
[
  {
    "id": 1,
    "title": "Beautiful Plot in Kinondoni",
    "description": "Prime location plot with excellent potential",
    "property_type": "plot",
    "status": "available",
    "verification_status": "approved",
    "region": "Dar es Salaam",
    "district": "Kinondoni",
    "council": "Kinondoni Municipal Council",
    "locality": "Masaki",
    "street": "Masaki Road",
    "ward": "Masaki Ward",
    "postal_code": "11101",
    "latitude": -6.7924,
    "longitude": 39.2083,
    "price": 50000000,
    "estimated_value": 55000000,
    "size": 1000,
    "area": 1000,
    "lot_number": "LT-001",
    "legal_area": "1000 sqm",
    "lot_type": "Residential",
    "lot_use": "Residential",
    "block": "Block A",
    "contact_name": "John Doe",
    "contact_role": "Owner",
    "contact_phone": "+255123456789",
    "contact_email": "john@example.com",
    "boundary_points": 4,
    "boundary_distance": 400,
    "boundary_coordinates": [
      {"lat": -6.7924, "lng": 39.2083},
      {"lat": -6.7925, "lng": 39.2084},
      {"lat": -6.7926, "lng": 39.2083},
      {"lat": -6.7925, "lng": 39.2082}
    ],
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Property by ID
```http
GET /properties/{property_id}
```

#### Create Property
```http
POST /properties
```

**Request Body:**
```json
{
  "title": "Beautiful Plot in Kinondoni",
  "description": "Prime location plot with excellent potential",
  "property_type": "plot",
  "region": "Dar es Salaam",
  "district": "Kinondoni",
  "council": "Kinondoni Municipal Council",
  "locality": "Masaki",
  "street": "Masaki Road",
  "ward": "Masaki Ward",
  "postal_code": "11101",
  "latitude": -6.7924,
  "longitude": 39.2083,
  "price": 50000000,
  "estimated_value": 55000000,
  "size": 1000,
  "area": 1000,
  "lot_number": "LT-001",
  "legal_area": "1000 sqm",
  "lot_type": "Residential",
  "lot_use": "Residential",
  "block": "Block A",
  "contact_name": "John Doe",
  "contact_role": "Owner",
  "contact_phone": "+255123456789",
  "contact_email": "john@example.com",
  "boundary_points": 4,
  "boundary_distance": 400,
  "boundary_coordinates": [
    {"lat": -6.7924, "lng": 39.2083},
    {"lat": -6.7925, "lng": 39.2084},
    {"lat": -6.7926, "lng": 39.2083},
    {"lat": -6.7925, "lng": 39.2082}
  ],
  "owner_id": 1
}
```

#### Update Property
```http
PUT /properties/{property_id}
```

#### Delete Property
```http
DELETE /properties/{property_id}
```

### 2. Property Images

#### Upload Property Image
```http
POST /properties/{property_id}/images
```

**Form Data:**
- `file` (file): Image file to upload
- `image_type` (string, default: "property"): Type of image
- `is_primary` (boolean, default: false): Whether this is the primary image

#### Get Property Images
```http
GET /properties/{property_id}/images
```

#### Delete Property Image
```http
DELETE /images/{image_id}
```

### 3. Property Listings

#### Create Property Listing
```http
POST /properties/{property_id}/listings
```

**Request Body:**
```json
{
  "property_id": 1,
  "listing_type": "sale",
  "listing_price": 50000000,
  "listing_description": "Beautiful plot for sale",
  "listing_end_date": "2024-12-31T23:59:59"
}
```

#### Get Property Listings
```http
GET /properties/{property_id}/listings
```

#### Get Active Listings
```http
GET /listings
```

**Query Parameters:**
- `listing_type` (string, optional): sale, rent, auction
- `limit` (int, default: 20)
- `offset` (int, default: 0)

### 4. Investment Projects

#### Get All Investment Projects
```http
GET /investment-projects
```

**Query Parameters:**
- `search_term` (string, optional): Search in title, description, location
- `category` (string, optional): commercial, residential, mixed-use
- `location` (string, optional): Filter by location
- `min_investment` (float, optional): Minimum investment amount
- `max_investment` (float, optional): Maximum investment amount
- `min_roi` (float, optional): Minimum expected ROI
- `max_roi` (float, optional): Maximum expected ROI
- `status` (string, optional): active, completed, cancelled
- `development_stage` (string, optional): planning, construction, completed
- `limit` (int, default: 20)
- `offset` (int, default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Masaki Commercial Complex",
    "description": "Modern commercial complex in prime location",
    "category": "commercial",
    "location": "Masaki, Dar es Salaam",
    "land_size": "5000 sqm",
    "zoning": "Commercial",
    "access": "Paved road access",
    "duration": "24 months",
    "development_stage": "planning",
    "status": "active",
    "total_project_value": 2000000000,
    "minimum_investment": 10000000,
    "current_investors": 5,
    "target_investors": 50,
    "funding_progress": 10.0,
    "expected_roi": 18.0,
    "investment_deadline": "2024-06-30",
    "latitude": -6.7924,
    "longitude": 39.2083,
    "features": ["Modern design", "Green building", "Parking spaces"],
    "project_manager_id": 1,
    "contact_name": "Jane Smith",
    "contact_role": "Project Manager",
    "contact_phone": "+255987654321",
    "contact_email": "jane@example.com",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Investment Project by ID
```http
GET /investment-projects/{project_id}
```

#### Create Investment Project
```http
POST /investment-projects
```

**Request Body:**
```json
{
  "title": "Masaki Commercial Complex",
  "description": "Modern commercial complex in prime location",
  "category": "commercial",
  "location": "Masaki, Dar es Salaam",
  "land_size": "5000 sqm",
  "zoning": "Commercial",
  "access": "Paved road access",
  "duration": "24 months",
  "development_stage": "planning",
  "total_project_value": 2000000000,
  "minimum_investment": 10000000,
  "target_investors": 50,
  "expected_roi": 18.0,
  "investment_deadline": "2024-06-30",
  "latitude": -6.7924,
  "longitude": 39.2083,
  "features": ["Modern design", "Green building", "Parking spaces"],
  "project_manager_id": 1,
  "contact_name": "Jane Smith",
  "contact_role": "Project Manager",
  "contact_phone": "+255987654321",
  "contact_email": "jane@example.com"
}
```

#### Update Investment Project
```http
PUT /investment-projects/{project_id}
```

#### Delete Investment Project
```http
DELETE /investment-projects/{project_id}
```

### 5. Project Investments

#### Invest in Project
```http
POST /investment-projects/{project_id}/invest
```

**Request Body:**
```json
{
  "project_id": 1,
  "investor_id": 2,
  "investment_amount": 15000000
}
```

#### Get Project Investments
```http
GET /investment-projects/{project_id}/investments
```

### 6. User Properties (My Properties)

#### Get User Properties
```http
GET /users/{user_id}/properties
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "property_id": 1,
    "acquisition_date": "2023-01-01T00:00:00",
    "acquisition_price": 45000000,
    "current_value": 50000000,
    "verification_status": "approved",
    "is_for_sale": false,
    "is_for_rent": false,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### Add User Property
```http
POST /users/{user_id}/properties
```

**Request Body:**
```json
{
  "user_id": 1,
  "property_id": 1,
  "acquisition_date": "2023-01-01T00:00:00",
  "acquisition_price": 45000000,
  "current_value": 50000000,
  "is_for_sale": false,
  "is_for_rent": false
}
```

#### Update User Property
```http
PUT /user-properties/{user_property_id}
```

**Request Body:**
```json
{
  "current_value": 55000000,
  "is_for_sale": true,
  "is_for_rent": false
}
```

### 7. Statistics

#### Get Real Estate Statistics
```http
GET /statistics
```

**Response:**
```json
{
  "total_properties": 150,
  "total_projects": 25,
  "total_investments": 300,
  "property_types": {
    "plot": 80,
    "house": 45,
    "apartment": 20,
    "commercial": 5
  },
  "property_statuses": {
    "available": 120,
    "sold": 20,
    "rented": 8,
    "pending": 2
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "detail": "Property not found"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## File Uploads

For image uploads, use `multipart/form-data` content type. Files are stored in the `uploads/properties/` directory structure.

## Pagination

Most list endpoints support pagination using `limit` and `offset` parameters. The default limit is 20 items per page.

## Search and Filtering

Most endpoints support comprehensive search and filtering options. Use the query parameters to narrow down results based on your requirements.
