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
        
        # Title style
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            alignment=1  # Center
        )
        
        # Heading style
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=8,
            spaceBefore=12
        )
        
        # Body style
        body_style = styles['Normal']
        body_style.fontSize = 10
        body_style.leading = 14
        
        # Title
        elements.append(Paragraph("ESCROW SERVICES AGREEMENT WITH SMART CONTRACT", title_style))
        elements.append(Paragraph("ARISPORTAL ESCROW", title_style))
        elements.append(Paragraph("Blockchain-Secured Escrow", styles['Italic']))
        elements.append(Spacer(1, 0.3*inch))
        
        # Agreement Info
        escrow_id = escrow_data.get('escrow_id', 'N/A')
        agreement_date = datetime.now().strftime("%B %d, %Y")
        
        elements.append(Paragraph(f"Agreement Date: {agreement_date}", body_style))
        elements.append(Paragraph(f"Escrow ID: {escrow_id}", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Parties Section
        elements.append(Paragraph("PARTIES TO THIS AGREEMENT:", heading_style))
        
        parties_data = [
            ['Party', 'Name', 'Email', 'Phone'],
            ['PAYER (Depositor)', escrow_data.get('payer_name', 'N/A'), escrow_data.get('payer_email', 'N/A'), escrow_data.get('payer_phone', 'N/A')],
            ['PAYEE (Recipient)', escrow_data.get('payee_name', 'N/A'), escrow_data.get('payee_email', 'N/A'), escrow_data.get('payee_phone', 'N/A')],
        ]
        
        parties_table = Table(parties_data, colWidths=[2*inch, 2*inch, 2*inch, 2*inch])
        parties_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(parties_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Transaction Details
        elements.append(Paragraph("TRANSACTION DETAILS:", heading_style))
        elements.append(Paragraph(f"Title: {escrow_data.get('title', 'N/A')}", body_style))
        
        description = escrow_data.get('description', 'No description provided')
        if description and description != 'No description provided':
            elements.append(Paragraph("Description:", body_style))
            for line in description.split('\n'):
                if line.strip():
                    elements.append(Paragraph(line.strip(), body_style))
        
        total_amount = escrow_data.get('total_amount', 0)
        elements.append(Paragraph(f"Total Amount: {total_amount:,.0f} TZS", body_style))
        
        # Payment Type
        payment_type = escrow_data.get('payment_type', 'FULL')
        if payment_type == 'FULL':
            payment_type_display = 'Full Payment'
            # Release Date
            release_date = escrow_data.get('release_date', 'TBD')
            if release_date and release_date != 'TBD':
                try:
                    if isinstance(release_date, str) and release_date:
                        dt = datetime.fromisoformat(release_date)
                        release_date_str = dt.strftime("%B %d, %Y")
                    else:
                        release_date_str = str(release_date)
                    elements.append(Paragraph(f"Release Date: {release_date_str}", body_style))
                except:
                    elements.append(Paragraph(f"Release Date: {release_date}", body_style))
        else:
            payment_type_display = 'Milestone Payments'
            
            # Add Milestones Section
            milestones = escrow_data.get('milestones', [])
            if milestones:
                elements.append(Spacer(1, 0.1*inch))
                elements.append(Paragraph("MILESTONE PAYMENTS:", styles['Heading3']))
                for idx, milestone in enumerate(milestones, 1):
                    milestone_desc = milestone.get('description', 'N/A')
                    milestone_amount = milestone.get('amount', 0)
                    milestone_date = milestone.get('completion_date', 'TBD')
                    
                    # Format the date nicely
                    if milestone_date and milestone_date != 'TBD' and isinstance(milestone_date, str):
                        try:
                            dt = datetime.fromisoformat(milestone_date.replace('Z', '+00:00'))
                            milestone_date = dt.strftime("%B %d, %Y")
                        except:
                            pass  # Keep original format if parsing fails
                    
                    elements.append(Paragraph(f"Milestone {idx}: {milestone_desc}", body_style))
                    elements.append(Paragraph(f"  Amount: {milestone_amount:,.0f} TZS", body_style))
                    elements.append(Paragraph(f"  Completion Date: {milestone_date}", body_style))
                    elements.append(Spacer(1, 0.1*inch))
        
        elements.append(Paragraph(f"Payment Type: {payment_type_display}", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Additional Terms
        terms = escrow_data.get('terms', '')
        if terms:
            elements.append(Paragraph("TERMS AND CONDITIONS:", heading_style))
            for line in terms.split('\n'):
                if line.strip():
                    elements.append(Paragraph(line.strip(), body_style))
            elements.append(Spacer(1, 0.1*inch))
        
        # Additional Notes
        notes = escrow_data.get('additional_notes', '')
        if notes:
            elements.append(Paragraph("ADDITIONAL NOTES:", styles['Heading3']))
            for line in notes.split('\n'):
                if line.strip():
                    elements.append(Paragraph(line.strip(), body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Smart Contract Section
        elements.append(Paragraph("SMART CONTRACT TECHNOLOGY:", heading_style))
        elements.append(Paragraph(
            "This escrow agreement is secured and enforced using blockchain smart contract technology. "
            "The smart contract is a self-executing program deployed on a blockchain network that holds "
            "funds in escrow and automatically releases them when predetermined conditions are met.",
            body_style
        ))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph("Smart Contract Features:", body_style))
        elements.append(Paragraph("• Automated fund holding and release mechanisms", body_style))
        elements.append(Paragraph("• Immutable transaction records on blockchain", body_style))
        elements.append(Paragraph("• Transparent and verifiable escrow operations", body_style))
        elements.append(Paragraph("• Cryptographically secured deposits", body_style))
        elements.append(Paragraph("• Automatic dispute resolution protocols", body_style))
        elements.append(Paragraph("• Programmable payment releases based on milestones or time conditions", body_style))
        elements.append(Paragraph("• Complete audit trail of all transactions", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Governing Law
        elements.append(Paragraph("GOVERNING LAW:", styles['Heading3']))
        elements.append(Paragraph(
            "This escrow agreement is governed by the laws of Tanzania. Funds are secured in a blockchain "
            "smart contract with automatic execution, dispute resolution, and refund capabilities. All "
            "transactions are recorded immutably on the blockchain for transparency and security.",
            body_style
        ))
        elements.append(PageBreak())
        
        # Signature Section
        elements.append(Paragraph("SIGNATURE SECTION", heading_style))
        elements.append(Spacer(1, 0.3*inch))
        
        elements.append(Paragraph("PAYER SIGNATURE:", styles['Heading3']))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph(f"Name: {escrow_data.get('payer_name', '__________')}", body_style))
        elements.append(Paragraph(f"Email: {escrow_data.get('payer_email', '__________')}", body_style))
        elements.append(Paragraph("Signature: _________________________", body_style))
        elements.append(Paragraph("Date: _________________________", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph("PAYEE SIGNATURE:", styles['Heading3']))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph(f"Name: {escrow_data.get('payee_name', '__________')}", body_style))
        elements.append(Paragraph(f"Email: {escrow_data.get('payee_email', '__________')}", body_style))
        elements.append(Paragraph("Signature: _________________________", body_style))
        elements.append(Paragraph("Date: _________________________", body_style))
        
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

