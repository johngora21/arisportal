#!/usr/bin/env python3
"""
Industry Template Manager - Managing industry-specific professional templates
Each template is designed for a specific industry with unique styling and requirements
"""

# Industry-specific template data - Each designed for its industry
templates_data = [
    {
        "id": "legal-firm",
        "name": "Legal Firm",
        "description": "Formal legal services invoice with time tracking, case references, and legal compliance",
        "source": "Legal Industry Standard",
        "stars": "★★★★★",
        "style": "formal",
        "type": "legal",
        "preview_path": "templates_output/legal_firm_invoice.pdf",
        "template_path": "templates_output/legal_firm_invoice.pdf",
        "is_available": True,
        "features": [
            "Time tracking with hourly rates",
            "Case reference numbers",
            "Attorney credentials display",
            "Legal disclaimers and terms",
            "Formal legal formatting",
            "Client matter tracking"
        ]
    },
    {
        "id": "healthcare",
        "name": "Healthcare",
        "description": "Medical services invoice with CPT codes, insurance breakdown, and HIPAA compliance",
        "source": "Healthcare Industry Standard",
        "stars": "★★★★★",
        "style": "medical",
        "type": "healthcare",
        "preview_path": "templates_output/healthcare_invoice.pdf",
        "template_path": "templates_output/healthcare_invoice.pdf",
        "is_available": True,
        "features": [
            "CPT medical codes",
            "Insurance coverage breakdown",
            "Patient copay calculation",
            "HIPAA compliant formatting",
            "Medical facility licensing",
            "Patient ID tracking"
        ]
    },
    {
        "id": "construction",
        "name": "Construction",
        "description": "Construction contractor invoice with labor/materials breakdown, permits, and project tracking",
        "source": "Construction Industry Standard",
        "stars": "★★★★★",
        "style": "industrial",
        "type": "construction",
        "preview_path": "templates_output/construction_invoice.pdf",
        "template_path": "templates_output/construction_invoice.pdf",
        "is_available": True,
        "features": [
            "Labor and materials breakdown",
            "Project permit tracking",
            "Equipment rental costs",
            "Progress billing format",
            "Construction licensing info",
            "Project manager details"
        ]
    },
    {
        "id": "finance",
        "name": "Finance",
        "description": "Financial services invoice with portfolio management, performance tracking, and regulatory compliance",
        "source": "Finance Industry Standard",
        "stars": "★★★★★",
        "style": "professional",
        "type": "finance",
        "preview_path": "templates_output/finance_invoice.pdf",
        "template_path": "templates_output/finance_invoice.pdf",
        "is_available": True,
        "features": [
            "Portfolio management fees",
            "Performance bonus tracking",
            "SEC compliance formatting",
            "Investment advisory details",
            "Client AUM tracking",
            "Risk profile information"
        ]
    },
    {
        "id": "logistics",
        "name": "Logistics",
        "description": "Logistics and shipping invoice with tracking numbers, route details, and freight calculations",
        "source": "Logistics Industry Standard",
        "stars": "★★★★★",
        "style": "industrial",
        "type": "logistics",
        "preview_path": "templates_output/logistics_invoice.pdf",
        "template_path": "templates_output/logistics_invoice.pdf",
        "is_available": True,
        "features": [
            "Shipment tracking numbers",
            "Weight and dimension tracking",
            "Route and distance calculation",
            "Fuel surcharge calculations",
            "Insurance coverage details",
            "DOT compliance information"
        ]
    },
    {
        "id": "retail",
        "name": "Retail",
        "description": "Retail store invoice with product SKUs, customer loyalty, and discount calculations",
        "source": "Retail Industry Standard",
        "stars": "★★★★★",
        "style": "modern",
        "type": "retail",
        "preview_path": "templates_output/retail_invoice.pdf",
        "template_path": "templates_output/retail_invoice.pdf",
        "is_available": True,
        "features": [
            "Product SKU tracking",
            "Customer loyalty programs",
            "VIP discount calculations",
            "Inventory management",
            "Customer service focus",
            "Return policy information"
        ]
    },
    {
        "id": "education",
        "name": "Education",
        "description": "Educational services invoice with course credits, student information, and academic billing",
        "source": "Education Industry Standard",
        "stars": "★★★★★",
        "style": "academic",
        "type": "education",
        "preview_path": "templates_output/education_invoice.pdf",
        "template_path": "templates_output/education_invoice.pdf",
        "is_available": True,
        "features": [
            "Course credit tracking",
            "Student ID management",
            "Financial aid calculations",
            "Academic program details",
            "Instructor information",
            "Scholarship tracking"
        ]
    },
    {
        "id": "freelance",
        "name": "Freelance",
        "description": "Freelance services invoice with hourly rates, project details, and creative billing",
        "source": "Freelance Industry Standard",
        "stars": "★★★★★",
        "style": "creative",
        "type": "freelance",
        "preview_path": "templates_output/freelance_invoice.pdf",
        "template_path": "templates_output/freelance_invoice.pdf",
        "is_available": True,
        "features": [
            "Hourly rate tracking",
            "Project milestone billing",
            "Creative service categories",
            "Portfolio references",
            "Client project details",
            "Flexible payment options"
        ]
    },
    {
        "id": "it",
        "name": "IT Services",
        "description": "IT services invoice with technical specifications, SLA tracking, and system details",
        "source": "IT Industry Standard",
        "stars": "★★★★★",
        "style": "technical",
        "type": "it",
        "preview_path": "templates_output/it_invoice.pdf",
        "template_path": "templates_output/it_invoice.pdf",
        "is_available": True,
        "features": [
            "Technical service tracking",
            "SLA compliance monitoring",
            "System migration details",
            "24/7 support billing",
            "Emergency response fees",
            "Infrastructure specifications"
        ]
    }
]

def get_all_templates():
    """Get all industry-specific templates"""
    return templates_data

def get_template_by_id(template_id):
    """Get a specific template by ID"""
    for template in templates_data:
        if template["id"] == template_id:
            return template
    return None

def get_available_styles():
    """Get available template styles"""
    styles = list(set([template["style"] for template in templates_data]))
    return styles

def get_available_types():
    """Get available template types"""
    types = list(set([template["type"] for template in templates_data]))
    return types

def filter_templates(style=None, template_type=None, search=None):
    """Filter templates based on criteria"""
    filtered = templates_data.copy()
    
    if style:
        filtered = [t for t in filtered if t["style"] == style]
    
    if template_type:
        filtered = [t for t in filtered if t["type"] == template_type]
    
    if search:
        search_lower = search.lower()
        filtered = [t for t in filtered if 
                   search_lower in t["name"].lower() or 
                   search_lower in t["description"].lower()]
    
    return filtered

def main():
    """Display industry templates information"""
    print("🏗️ Industry-Specific Invoice Templates")
    print("=" * 60)
    print(f"📋 Total Templates: {len(templates_data)}")
    print(f"🎯 Styles: {', '.join(get_available_styles())}")
    print(f"📊 Types: {', '.join(get_available_types())}")
    print("\n📄 Available Industry Templates:")
    
    for i, template in enumerate(templates_data, 1):
        print(f"\n{i}. {template['name']} ({template['id']})")
        print(f"   Description: {template['description']}")
        print(f"   Style: {template['style']} | Type: {template['type']}")
        print(f"   Features: {', '.join(template['features'][:3])}...")
        print(f"   Status: {'✅ Available' if template['is_available'] else '❌ Coming Soon'}")

if __name__ == "__main__":
    main()




