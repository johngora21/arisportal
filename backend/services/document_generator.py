"""
Document Generator Service
Generates legal documents for escrow agreements
"""

import os
import io
from datetime import datetime
from typing import Dict, Tuple
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, CondPageBreak
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Rect, Drawing, String
from reportlab.graphics import renderPDF
import os

# Register Kalam handwritten font for signatures
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    font_path = os.path.join(base_dir, 'fonts', 'Kalam-Regular.ttf')
    if os.path.exists(font_path):
        pdfmetrics.registerFont(TTFont('Kalam', font_path))
except Exception as e:
    pass  # Fallback to default fonts if loading fails
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

class EscrowDocumentGenerator:
    """Generates legal escrow documents"""
    
    def __init__(self):
        self.template_path = os.path.join(
            os.path.dirname(__file__),
            '..', 
            'templates',
            'escrow_agreement_template.txt'
        )
    
    def generate_escrow_agreement(self, escrow_data: Dict) -> str:
        """
        Generate a legal escrow agreement document
        
        Args:
            escrow_data: Dictionary containing escrow details
            
        Returns:
            Formatted legal document text
        """
        try:
            # Load template
            with open(self.template_path, 'r') as f:
                template = f.read()
            
            # Format amounts
            total_amount = f"{escrow_data.get('total_amount', 0):,.0f}"
            
            # Format date
            release_date = escrow_data.get('release_date', 'TBD')
            if release_date and release_date != 'TBD':
                try:
                    dt = datetime.fromisoformat(release_date)
                    release_date = dt.strftime("%B %d, %Y")
                except:
                    release_date = 'TBD'
            
            # Created date
            created_date = datetime.now().strftime("%B %d, %Y")
            
            # Replace placeholders
            document = template.format(
                AGREEMENT_DATE=datetime.now().strftime("%B %d, %Y"),
                ESCROW_ID=escrow_data.get('escrow_id', 'N/A'),
                PAYER_NAME=escrow_data.get('payer_name', 'N/A'),
                PAYER_EMAIL=escrow_data.get('payer_email', 'N/A'),
                PAYER_PHONE=escrow_data.get('payer_phone', 'N/A'),
                PAYEE_NAME=escrow_data.get('payee_name', 'N/A'),
                PAYEE_EMAIL=escrow_data.get('payee_email', 'N/A'),
                PAYEE_PHONE=escrow_data.get('payee_phone', 'N/A'),
                TITLE=escrow_data.get('title', 'N/A'),
                DESCRIPTION=escrow_data.get('description', 'No description provided'),
                TOTAL_AMOUNT=total_amount,
                PAYMENT_TYPE=escrow_data.get('payment_type', 'Full Payment'),
                RELEASE_DATE=release_date,
                ADDITIONAL_TERMS=escrow_data.get('terms', 'No additional terms specified'),
                ADDITIONAL_NOTES=escrow_data.get('additional_notes', 'No additional notes'),
                CREATED_DATE=created_date
            )
            
            return document
            
        except Exception as e:
            return f"Error generating document: {str(e)}"
    
    def generate_pdf_agreement(self, escrow_data: Dict) -> Tuple[bytes, str]:
        """
        Generate a PDF escrow agreement that can be downloaded and signed
        
        Args:
            escrow_data: Escrow data dictionary
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        # Create a BytesIO buffer for the PDF
        buffer = io.BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Define custom styles
        styles = getSampleStyleSheet()
        
        # STANDARDIZED FONT SYSTEM - Professional Legal Document
        # Using consistent 10pt base with proper hierarchy
        
        # Title style - Main document title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=14,  # Standardized: Large but professional (10pt + 4pt for title)
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#000000'),
            spaceAfter=12,
            alignment=1,  # Center
            leading=18
        )
        
        # Subtitle style - Document subtitle
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=10,  # Standardized: 10pt base
            fontName='Helvetica',
            textColor=colors.HexColor('#374151'),
            spaceAfter=14,
            alignment=1,
            leading=14
        )
        
        # Heading style - Section headings (SECTION 1, SECTION 2, etc.)
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,  # Increased: 12pt for better section title visibility
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#000000'),
            spaceAfter=8,
            spaceBefore=12,
            leading=16  # Adjusted line height for larger font size
        )
        
        # Body style - All regular text content
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=10,  # Standardized: Professional 10pt
            fontName='Helvetica',
            alignment=4,  # Justified alignment (like Cmd+J in Word)
            leading=14,
            spaceAfter=6
        )
        
        # Signature style - For signature sections
        signature_style = ParagraphStyle(
            'SignatureStyle',
            parent=styles['Normal'],
            fontSize=10,  # Standardized: 10pt base
            fontName='Helvetica',
            leading=14,
            spaceAfter=4
        )
        
        # Professional header with original content (no horizontal lines)
        elements.append(Spacer(1, 0.3*inch))
        
        # Create a table for top left (Escrow ID) and top right (Logo) alignment
        from reportlab.platypus import Table, TableStyle
        from reportlab.lib import colors as rl_colors
        from reportlab.graphics.shapes import Drawing, Rect, String
        from reportlab.graphics import renderPDF
        
        escrow_id = escrow_data.get('escrow_id', 'N/A')
        
        # Escrow ID style for top left
        escrow_id_style = ParagraphStyle(
            'EscrowIdStyle',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica-Bold',
            alignment=0,  # Left alignment
            spaceAfter=0,
            leading=14
        )
        
        # Create a square logo placeholder (big enough to replace with actual logo later)
        logo_drawing = Drawing(80, 80)  # 80x80 point square
        
        # Create a square with border that can be easily replaced with actual logo
        square = Rect(0, 0, 80, 80)
        square.fillColor = rl_colors.HexColor('#F0F8FF')  # Light blue fill
        square.strokeColor = rl_colors.HexColor('#007BFF')  # Blue border
        square.strokeWidth = 2
        
        logo_drawing.add(square)
        
        # Add "LOGO" text in center for now (replace this entire Drawing later)
        logo_text = String(40, 35, "LOGO", textAnchor='middle')
        logo_text.fontName = 'Helvetica-Bold'
        logo_text.fontSize = 12
        logo_text.fillColor = rl_colors.HexColor('#007BFF')
        
        logo_drawing.add(logo_text)
        
        logo_flowable = logo_drawing
        
        # Logo only (no redundant escrow ID)
        elements.append(logo_flowable)
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph("ESCROW SERVICES AGREEMENT", title_style))
        elements.append(Paragraph("Arisportal Escrow Services", subtitle_style))
        elements.append(Paragraph("Blockchain-Secured Transaction with Smart Contract", subtitle_style))
        
        # Add more space from top section
        elements.append(Spacer(1, 0.6*inch))
        
        # Escrow ID on left, Date on right in a table
        agreement_date = datetime.now().strftime("%B %d, %Y")
        date_style = ParagraphStyle(
            'DateStyle',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica',
            alignment=2,  # Right alignment
            spaceAfter=8,
            leading=14
        )
        
        escrow_id_left_style = ParagraphStyle(
            'EscrowIdLeftStyle',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica-Bold',
            alignment=0,  # Left alignment
            spaceAfter=8,
            leading=14
        )
        
        # Create a table with escrow ID on left, date on right
        date_table_data = [
            [Paragraph(f"<b>{escrow_id}</b>", escrow_id_left_style), 
             Paragraph(f"{agreement_date}", date_style)]
        ]
        
        date_table = Table(date_table_data, colWidths=[3*inch, 3*inch])
        date_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        elements.append(date_table)
        elements.append(Spacer(1, 0.4*inch))
        
        # SECTION 1: PARTIES TO THIS AGREEMENT - Professional legal format
        elements.append(CondPageBreak(5*inch))  # Ensure section doesn't split across pages
        elements.append(Paragraph("SECTION 1: PARTIES TO THIS AGREEMENT", heading_style))
        elements.append(Spacer(1, 0.15*inch))
        
        # Professional legal statement format
        payer_name = escrow_data.get('payer_name', '[PAYER NAME]')
        payee_name = escrow_data.get('payee_name', '[PAYEE NAME]')
        
        parties_text = f"""This Escrow Services Agreement establishes a fiduciary arrangement between <b>{payer_name}</b>, hereinafter designated as the depositing party, who undertakes to place specified funds under escrow administration, and <b>{payee_name}</b>, hereinafter designated as the beneficiary party, who shall receive disbursement of such funds contingent upon satisfactory completion of all stipulated performance criteria and contractual obligations. Both contracting parties hereby affirm their comprehensive understanding of all terms, conditions, and legal ramifications contained within this Agreement, and voluntarily submit to its binding authority and enforceability under applicable law."""
        
        elements.append(Paragraph(parties_text, body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Transaction Details - Professional formatted section
        elements.append(CondPageBreak(3*inch))  # Ensure section doesn't split across pages
        elements.append(Paragraph("SECTION 2: TRANSACTION SUMMARY", heading_style))
        elements.append(Spacer(1, 0.15*inch))
        
        # Professional legal statement format for transaction details
        total_amount = escrow_data.get('total_amount', 0)
        payment_type = escrow_data.get('payment_type', 'FULL')
        title = escrow_data.get('title', '[TRANSACTION TITLE]')
        description = escrow_data.get('description', 'No description provided')
        
        # Determine payment type display
        if payment_type == 'FULL':
            payment_type_display = 'full payment upon completion'
        elif hasattr(payment_type, 'value') and payment_type.value == 'MILESTONE':
            payment_type_display = 'milestone-based payment schedule'
        else:
            payment_type_display = 'milestone-based payment schedule'
        
        # Create professional transaction summary paragraph
        transaction_summary = f"""The underlying commercial transaction secured by this escrow arrangement pertains to <b>{title}</b>. """
        
        if description and description != 'No description provided':
            transaction_summary += f"""{description} """
        
        transaction_summary += f"""The aggregate monetary consideration to be held in escrow custody and administered pursuant to the terms of this Agreement amounts to <b>{total_amount:,.0f} Tanzanian Shillings</b>. The systematic disbursement of these escrowed funds shall be executed in accordance with a predetermined {payment_type_display}, with each disbursement contingent upon verification and acceptance of completed deliverables as specified in the comprehensive milestone framework detailed hereinbelow, and subject to strict adherence to all terms, conditions, and performance benchmarks established within this contractual instrument."""
        
        elements.append(Paragraph(transaction_summary, body_style))
        
        
        elements.append(Spacer(1, 0.25*inch))
        
        # Payment Type and Milestones - Professional section
        if payment_type == 'MILESTONE':
            # Add Milestones Section with professional table
            milestones = escrow_data.get('milestones', [])
            if milestones:
                elements.append(Spacer(1, 0.4*inch))  # Add significant space before milestone section
                elements.append(CondPageBreak(5*inch))  # Ensure milestone table doesn't split
                elements.append(Paragraph("MILESTONE PAYMENT SCHEDULE", heading_style))
                elements.append(Spacer(1, 0.15*inch))
                
                milestone_data = [
                    [Paragraph('#', body_style), Paragraph('Description', body_style), 
                     Paragraph('Amount', body_style), Paragraph('Date', body_style)]
                ]
                for idx, milestone in enumerate(milestones, 1):
                    milestone_desc = milestone.get('description', 'N/A')
                    milestone_amount = milestone.get('amount', 0)
                    milestone_date = milestone.get('completion_date', 'TBD')
                    
                    # Format the date nicely
                    if milestone_date and milestone_date != 'TBD' and isinstance(milestone_date, str):
                        try:
                            dt = datetime.fromisoformat(milestone_date.replace('Z', '+00:00'))
                            milestone_date_str = dt.strftime("%b %d, %Y")
                        except:
                            milestone_date_str = milestone_date
                    else:
                        milestone_date_str = milestone_date
                    
                    milestone_data.append([
                        Paragraph(str(idx), body_style),
                        Paragraph(milestone_desc, body_style),  # Remove truncation, let it wrap
                        Paragraph(f"{milestone_amount:,.0f}", body_style),
                        Paragraph(milestone_date_str, body_style)
                    ])
                
                milestone_table = Table(milestone_data, colWidths=[0.5*inch, 3.5*inch, 1.5*inch, 1.8*inch])
                milestone_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),  # Standardized 10pt font size
                    ('ALIGN', (0, 0), (0, -1), 'CENTER'),
                    ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
                    ('ALIGN', (1, 0), (3, -1), 'LEFT'),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ]))
                elements.append(milestone_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Additional Terms
        terms = escrow_data.get('terms', '')
        if terms and terms.strip():
            elements.append(CondPageBreak(4*inch))  # Ensure section doesn't split across pages
            elements.append(Paragraph("SECTION 3: TERMS AND CONDITIONS", heading_style))
            elements.append(Spacer(1, 0.1*inch))
            
            # Convert number to Roman numeral
            def to_roman(num):
                val = [
                    1000, 900, 500, 400,
                    100, 90, 50, 40,
                    10, 9, 5, 4,
                    1
                ]
                syb = [
                    "M", "CM", "D", "CD",
                    "C", "XC", "L", "XL",
                    "X", "IX", "V", "IV",
                    "I"
                ]
                roman_num = ''
                i = 0
                while num > 0:
                    for _ in range(num // val[i]):
                        roman_num += syb[i]
                        num -= val[i]
                    i += 1
                return roman_num
            
            term_lines = [line.strip() for line in terms.split('\n') if line.strip()]
            for idx, line in enumerate(term_lines, 1):
                elements.append(Paragraph(f"{to_roman(idx).lower()}. {line}", body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Additional Notes
        notes = escrow_data.get('additional_notes', '')
        if notes and notes.strip():
            elements.append(CondPageBreak(4*inch))  # Ensure section doesn't split across pages
            elements.append(Paragraph("SECTION 4: ADDITIONAL NOTES", heading_style))
            elements.append(Spacer(1, 0.1*inch))
            
            # Convert number to Roman numeral
            def to_roman(num):
                val = [
                    1000, 900, 500, 400,
                    100, 90, 50, 40,
                    10, 9, 5, 4,
                    1
                ]
                syb = [
                    "M", "CM", "D", "CD",
                    "C", "XC", "L", "XL",
                    "X", "IX", "V", "IV",
                    "I"
                ]
                roman_num = ''
                i = 0
                while num > 0:
                    for _ in range(num // val[i]):
                        roman_num += syb[i]
                        num -= val[i]
                    i += 1
                return roman_num
            
            note_lines = [line.strip() for line in notes.split('\n') if line.strip()]
            for idx, line in enumerate(note_lines, 1):
                elements.append(Paragraph(f"{to_roman(idx).lower()}. {line}", body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Smart Contract Section
        elements.append(CondPageBreak(6*inch))  # Ensure section doesn't split across pages
        elements.append(Paragraph("SECTION 5: SMART CONTRACT SECURITY", heading_style))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph(
            "This escrow agreement is secured using blockchain smart contract technology. "
            "The smart contract automatically holds funds and releases them when conditions are met.",
            body_style
        ))
        elements.append(Spacer(1, 0.15*inch))
        
        # Smart Contract Features in a cleaner format
        features = [
            "Automated fund holding and release",
            "Immutable blockchain transaction records",
            "Transparent and verifiable operations",
            "Cryptographically secured deposits",
            "Automatic dispute resolution",
            "Complete audit trail"
        ]
        
        for i, feature in enumerate(features, start=1):
            # Use lowercase Roman numerals for professional contract styling
            roman_numerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
            if i <= len(roman_numerals):
                elements.append(Paragraph(f"{roman_numerals[i-1]}. {feature}", body_style))
            else:
                elements.append(Paragraph(f"{i}. {feature}", body_style))
        
        elements.append(Spacer(1, 0.2*inch))
        
        # Signature Section - Clean text-based layout (NO TABLES)
        elements.append(Spacer(1, 0.3*inch))
        elements.append(CondPageBreak(5*inch))  # Ensure section doesn't split across pages
        elements.append(Paragraph("SECTION 6: EXECUTION AND SIGNATURES", heading_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Generate automatic signature for payer
        payer_name = escrow_data.get("payer_name", "")
        payer_signature = ""
        if payer_name:
            # Create a realistic signature: first initial + last name
            name_parts = payer_name.split()
            if len(name_parts) >= 2:
                # Use first initial with dot + last name for signature (like real signatures)
                first_initial = name_parts[0][0].upper()
                last_name = name_parts[-1]
                payer_signature = f"{first_initial}.{last_name}"
            else:
                # If only one name, use the first letter + rest of name
                payer_signature = f"{payer_name[0].upper()}{payer_name[1:].lower()}" if len(payer_name) > 1 else payer_name
        
        # Get current date for signature
        signature_date = datetime.now().strftime("%B %d, %Y")
        
        # Create signature style for script-like appearance
        signature_style = ParagraphStyle(
            'SignatureStyle',
            parent=styles['Normal'],
            fontSize=18,
            fontName='Times-Italic',  # Cursive/script-like font
            textColor=colors.blue,    # Blue ink color
            alignment=0,  # Left alignment
            spaceAfter=6,
            leading=22
        )
        
        # Create a more stylized signature style
        handwritten_style = ParagraphStyle(
            'HandwrittenStyle',  
            parent=styles['Normal'],
            fontSize=20,
            fontName='Times-Italic',
            textColor=colors.navy,
            alignment=0,
            spaceAfter=8,
            leading=24
        )
        
        # Create simple side-by-side signature blocks using basic table with spacer column
        signature_data = [
            # Row 1: Headers
            [Paragraph('<b>PAYER SIGNATURE BLOCK</b>', body_style), 
             Paragraph('<b>PAYEE SIGNATURE BLOCK</b>', body_style)],
            # Row 2: Names
            [Paragraph(f'<b>Name:</b> {escrow_data.get("payer_name", "___________________________")}', body_style),
             Paragraph(f'<b>Name:</b> {escrow_data.get("payee_name", "___________________________")}', body_style)],
            # Row 3: Emails  
            [Paragraph(f'<b>Email:</b> {escrow_data.get("payer_email", "___________________________")}', body_style),
             Paragraph(f'<b>Email:</b> {escrow_data.get("payee_email", "___________________________")}', body_style)],
            # Row 4: Phones
            [Paragraph(f'<b>Phone:</b> {escrow_data.get("payer_phone", "___________________________")}', body_style),
             Paragraph(f'<b>Phone:</b> {escrow_data.get("payee_phone", "___________________________")}', body_style)],
            # Row 5: Empty space for signature area
            [Paragraph('', body_style), Paragraph('', body_style)],
            # Row 6: Signatures - Payer gets automatic signature, Payee gets blank line  
            # Use Kalam handwritten font for authentic signature style
            [Paragraph(f'<b>Signature:</b><br/><br/><font name="Kalam" size="21" color="#2563eb">{payer_signature}</font>', body_style) if payer_signature else Paragraph('<b>Signature:</b>', body_style),
             Paragraph('<b>Signature:</b><br/><br/>___________________________', body_style)],
            # Row 7: Dates - Payer gets current date, Payee gets blank
            [Paragraph(f'<b>Date:</b> {signature_date}', body_style),
             Paragraph('<b>Date:</b> ___________________________', body_style)]
        ]
        
        # Create the signature table with proper column widths for text wrapping
        # Use full page width (8.5" - margins) to span entire usable width
        page_width = 8.5*inch
        left_margin = 0.75*inch  # Standard margin
        right_margin = 0.75*inch  # Standard margin
        usable_width = page_width - left_margin - right_margin  # ~7 inches
        
        # Set column widths to ensure proper text wrapping
        col_width = (usable_width - 0.2*inch) / 2  # Leave space between columns
        signature_table = Table(signature_data, colWidths=[col_width, col_width])
        signature_table.hAlign = 'LEFT'  # Start table at left margin
        signature_table.setStyle(TableStyle([
            # Header row styling
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),  # Standardized 10pt font size
            # Body styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),  # Standardized 10pt font size
            # Alignment - Both columns LEFT aligned within their cells
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),    # All text left-aligned within cells
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            # Padding for clean layout
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ]))
        
        # Keep table at normal position (not forced left) - only PAYER column is flush left
        
        elements.append(signature_table)
        elements.append(Spacer(1, 0.3*inch))
        
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF bytes
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        # Filename
        filename = f"Escrow_Agreement_{escrow_id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        return pdf_bytes, filename
    
    def generate_contract_response(self, escrow_data: Dict, document_type: str = "agreement") -> Dict:
        """
        Generate a response for the frontend
        
        Args:
            escrow_data: Escrow data
            document_type: 'agreement' or 'smart_contract'
            
        Returns:
            Response dictionary with base64 encoded PDF
        """
        if document_type == "agreement":
            # Generate PDF
            pdf_bytes, filename = self.generate_pdf_agreement(escrow_data)
            
            # Return base64 encoded PDF for frontend to download
            import base64
            pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
            
            return {
                "contract_name": filename,
                "document_type": "legal_agreement",
                "format": "pdf",
                "code": pdf_base64,
                "description": f"Legal escrow agreement for transaction {escrow_data.get('title', 'N/A')}",
                "features": [
                    "Downloadable PDF document",
                    "Legal agreement document",
                    "Terms and conditions",
                    "Payer and Payee information",
                    "Dispute resolution",
                    "Refund policy",
                    "Governing law",
                    "Signature section"
                ]
            }
        else:
            # For smart contract code
            return {
                "contract_name": "EscrowContract.sol",
                "solidity_version": "^0.8.0",
                "license": "MIT",
                "code": "",  # Will be loaded by the router
                "description": "Blockchain smart contract code for escrow",
                "features": [
                    "Full payment escrow",
                    "Milestone-based payments",
                    "Dispute resolution",
                    "Automatic refunds",
                    "Role-based access control",
                    "Event logging"
                ]
            }


# Create singleton instance
document_generator = EscrowDocumentGenerator()

