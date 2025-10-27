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
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
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
        
        # Title style - Large, bold, professional
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=22,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#000000'),
            spaceAfter=12,
            alignment=1,  # Center
            leading=26
        )
        
        # Subtitle style
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=14,
            fontName='Helvetica',
            textColor=colors.HexColor('#374151'),
            spaceAfter=24,
            alignment=1,
            leading=18
        )
        
        # Heading style - Bold, professional
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=13,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#000000'),
            spaceAfter=10,
            spaceBefore=16,
            leading=18
        )
        
        # Subheading style
        subheading_style = ParagraphStyle(
            'CustomSubheading',
            parent=styles['Heading3'],
            fontSize=11,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=8,
            spaceBefore=12,
            leading=16
        )
        
        # Body style - Professional serif-like font size
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=11,
            fontName='Helvetica',
            leading=15,
            spaceAfter=8
        )
        
        # Signature label style
        signature_label_style = ParagraphStyle(
            'SignatureLabel',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica-Bold',
            spaceAfter=4
        )
        
        # Title - Professional centered header
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph("ESCROW SERVICES AGREEMENT", title_style))
        elements.append(Spacer(1, 0.15*inch))
        elements.append(Paragraph("ARISPORTAL ESCROW SERVICES", subtitle_style))
        elements.append(Paragraph("Blockchain-Secured Transaction with Smart Contract", subtitle_style))
        elements.append(Paragraph("_____________________________", body_style))
        elements.append(Spacer(1, 0.35*inch))
        
        # Agreement Info - Professional info box
        escrow_id = escrow_data.get('escrow_id', 'N/A')
        agreement_date = datetime.now().strftime("%B %d, %Y")
        
        info_style = TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (1, 0), 10),
            ('FONTSIZE', (0, 1), (1, 1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ])
        
        info_data = [
            ['Agreement Date', 'Escrow ID'],
            [agreement_date, escrow_id]
        ]
        
        info_table = Table(info_data, colWidths=[3*inch, 3*inch])
        info_table.setStyle(info_style)
        elements.append(info_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Parties Section - Professional table
        elements.append(Paragraph("PARTIES TO THIS AGREEMENT", heading_style))
        elements.append(Spacer(1, 0.15*inch))
        
        parties_data = [
            ['Party Role', 'Full Name', 'Email Address', 'Phone Number'],
            ['PAYER (Depositor)', escrow_data.get('payer_name', 'N/A'), escrow_data.get('payer_email', 'N/A'), escrow_data.get('payer_phone', 'N/A')],
            ['PAYEE (Recipient)', escrow_data.get('payee_name', 'N/A'), escrow_data.get('payee_email', 'N/A'), escrow_data.get('payee_phone', 'N/A')],
        ]
        
        parties_table = Table(parties_data, colWidths=[1.5*inch, 2.5*inch, 2*inch, 2*inch])
        parties_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#374151')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        elements.append(parties_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Transaction Details - Professional formatted section
        elements.append(Paragraph("TRANSACTION DETAILS", heading_style))
        elements.append(Spacer(1, 0.15*inch))
        
        # Create a transaction details table
        total_amount = escrow_data.get('total_amount', 0)
        payment_type = escrow_data.get('payment_type', 'FULL')
        
        transaction_details = []
        transaction_details.append(['<b>Transaction Title</b>', escrow_data.get('title', 'N/A')])
        
        description = escrow_data.get('description', 'No description provided')
        if description and description != 'No description provided':
            transaction_details.append(['<b>Description</b>', description[:80] + ('...' if len(description) > 80 else '')])
        
        transaction_details.append(['<b>Total Escrow Amount</b>', f"{total_amount:,.0f} TZS"])
        
        if payment_type == 'FULL':
            payment_type_display = 'Full Payment - Single Release'
            release_date = escrow_data.get('release_date', 'TBD')
            if release_date and release_date != 'TBD':
                try:
                    if isinstance(release_date, str) and release_date:
                        dt = datetime.fromisoformat(release_date)
                        release_date_str = dt.strftime("%B %d, %Y")
                    else:
                        release_date_str = str(release_date)
                    transaction_details.append(['<b>Scheduled Release Date</b>', release_date_str])
                except:
                    pass
        else:
            payment_type_display = 'Milestone-Based Payments'
        transaction_details.append(['<b>Payment Schedule</b>', payment_type_display])
        
        detail_table = Table(transaction_details, colWidths=[2.2*inch, 3.8*inch])
        detail_table.setStyle(TableStyle([
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1f2937')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f9fafb')),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ]))
        elements.append(detail_table)
        elements.append(Spacer(1, 0.25*inch))
        
        # Payment Type and Milestones - Professional section
        if payment_type == 'MILESTONE':
            # Add Milestones Section with professional table
            milestones = escrow_data.get('milestones', [])
            if milestones:
                elements.append(Paragraph("MILESTONE PAYMENT SCHEDULE", heading_style))
                elements.append(Spacer(1, 0.15*inch))
                
                milestone_data = [['#', 'Description', 'Amount', 'Date']]
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
                        str(idx),
                        milestone_desc[:35],
                        f"{milestone_amount:,.0f}",
                        milestone_date_str
                    ])
                
                milestone_table = Table(milestone_data, colWidths=[0.4*inch, 2.2*inch, 1.3*inch, 1.5*inch])
                milestone_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 8),
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
            elements.append(Paragraph("TERMS AND CONDITIONS", heading_style))
            elements.append(Spacer(1, 0.1*inch))
            for line in terms.split('\n'):
                if line.strip():
                    elements.append(Paragraph(f"• {line.strip()}", body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Additional Notes
        notes = escrow_data.get('additional_notes', '')
        if notes and notes.strip():
            elements.append(Paragraph("ADDITIONAL NOTES", heading_style))
            elements.append(Spacer(1, 0.1*inch))
            for line in notes.split('\n'):
                if line.strip():
                    elements.append(Paragraph(line.strip(), body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Smart Contract Section
        elements.append(Paragraph("SMART CONTRACT SECURITY", heading_style))
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
        
        for feature in features:
            elements.append(Paragraph(f"✓ {feature}", body_style))
        
        elements.append(Spacer(1, 0.2*inch))
        
        # Governing Law
        elements.append(Paragraph("GOVERNING LAW", heading_style))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph(
            "This escrow agreement is governed by the laws of Tanzania. Funds are secured in a blockchain "
            "smart contract with automatic execution, dispute resolution, and refund capabilities.",
            body_style
        ))
        elements.append(Spacer(1, 0.3*inch))
        elements.append(PageBreak())
        
        # Signature Section - Professional layout with boxes
        elements.append(Spacer(1, 0.4*inch))
        elements.append(Paragraph("EXECUTION AND SIGNATURES", heading_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Payer Signature Block with border
        signature_box_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ])
        
        # Payer block
        payer_signature_data = [
            ['PAYER SIGNATURE BLOCK'],
            [f'<b>Name:</b> {escrow_data.get("payer_name", "___________________________")}'],
            [f'<b>Email:</b> {escrow_data.get("payer_email", "___________________________")}'],
            [f'<b>Phone:</b> {escrow_data.get("payer_phone", "___________________________")}'],
            [''],  # Spacer line
            ['Signature: ________________________________'],
            ['Date: _________________________']
        ]
        
        payer_table = Table(payer_signature_data, colWidths=[6*inch])
        payer_table.setStyle(signature_box_style)
        elements.append(payer_table)
        
        elements.append(Spacer(1, 0.25*inch))
        
        # Payee block
        payee_signature_data = [
            ['PAYEE SIGNATURE BLOCK'],
            [f'<b>Name:</b> {escrow_data.get("payee_name", "___________________________")}'],
            [f'<b>Email:</b> {escrow_data.get("payee_email", "___________________________")}'],
            [f'<b>Phone:</b> {escrow_data.get("payee_phone", "___________________________")}'],
            [''],  # Spacer line
            ['Signature: ________________________________'],
            ['Date: _________________________']
        ]
        
        payee_table = Table(payee_signature_data, colWidths=[6*inch])
        payee_table.setStyle(signature_box_style)
        elements.append(payee_table)
        
        elements.append(Spacer(1, 0.3*inch))
        
        # Witness/Platform block
        platform_signature_data = [
            ['ARISPORTAL ESCROW - AUTHORIZED SIGNATURE'],
            ['This contract is executed and administered by ArisPortal Escrow Services'],
            ['<b>Platform Representative:</b> ArisPortal Escrow Administrator'],
            ['<b>Platform Address:</b> ArisPortal, Tanzania'],
            ['<b>Execution Date:</b> ' + agreement_date],
            [''],
            ['Authorized Signature: [DIGITAL SEAL]'],
            ['Date: ' + agreement_date]
        ]
        
        platform_table = Table(platform_signature_data, colWidths=[6*inch])
        platform_table.setStyle(signature_box_style)
        elements.append(platform_table)
        
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

