#!/usr/bin/env python3
"""
Professional Invoice Generator using ReportLab
Based on real GitHub template designs
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json
from datetime import datetime
import os

class InvoiceGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
        
    def setup_custom_styles(self):
        """Setup custom paragraph styles for professional invoices"""
        
        # Title style (like Manta template)
        self.styles.add(ParagraphStyle(
            name='InvoiceTitle',
            parent=self.styles['Heading1'],
            fontSize=32,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=12,
            alignment=TA_LEFT,
            fontName='Helvetica-Bold'
        ))
        
        # Company name style
        self.styles.add(ParagraphStyle(
            name='CompanyName',
            parent=self.styles['Normal'],
            fontSize=16,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=6,
            fontName='Helvetica-Bold'
        ))
        
        # Section headers
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#4a5568'),
            spaceAfter=12,
            fontName='Helvetica-Bold',
            textTransform='uppercase'
        ))
        
        # Table header style
        self.styles.add(ParagraphStyle(
            name='TableHeader',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#4a5568'),
            fontName='Helvetica-Bold',
            alignment=TA_LEFT
        ))
        
        # Table data style
        self.styles.add(ParagraphStyle(
            name='TableData',
            parent=self.styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#2d3748'),
            fontName='Helvetica'
        ))

    def generate_manta_invoice(self, invoice_data, output_path):
        """Generate Manta-style invoice using ReportLab"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Header section
        header_data = [
            [Paragraph("INVOICE", self.styles['InvoiceTitle']), ""],
            [Paragraph(f"#{invoice_data['invoice_number']}", self.styles['Normal']), 
             f"Date: {invoice_data['date']}<br/>Due: {invoice_data['due_date']}"]
        ]
        
        header_table = Table(header_data, colWidths=[4*inch, 2*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 20))
        
        # Bill From/To section
        bill_data = [
            [
                Paragraph("BILL FROM", self.styles['SectionHeader']),
                Paragraph("BILL TO", self.styles['SectionHeader'])
            ],
            [
                Paragraph(f"<b>{invoice_data['company_name']}</b><br/>{invoice_data['company_email']}", 
                         self.styles['Normal']),
                Paragraph(f"<b>{invoice_data['client_name']}</b><br/>{invoice_data['client_email']}", 
                         self.styles['Normal'])
            ]
        ]
        
        bill_table = Table(bill_data, colWidths=[3*inch, 3*inch])
        bill_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(bill_table)
        story.append(Spacer(1, 30))
        
        # Items table
        items_data = [['DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']]
        
        for item in invoice_data['items']:
            items_data.append([
                Paragraph(item['description'], self.styles['TableData']),
                Paragraph(str(item['quantity']), self.styles['TableData']),
                Paragraph(f"${item['rate']:.2f}", self.styles['TableData']),
                Paragraph(f"${item['amount']:.2f}", self.styles['TableData'])
            ])
        
        items_table = Table(items_data, colWidths=[3*inch, 0.8*inch, 1*inch, 1*inch])
        items_table.setStyle(TableStyle([
            # Header styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#edf2f7')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#4a5568')),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (1, 0), (-1, 0), 'CENTER'),
            ('ALIGN', (2, 0), (-1, 0), 'RIGHT'),
            
            # Data styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 14),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
            
            # Borders and padding
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('LEFTPADDING', (0, 0), (-1, -1), 16),
            ('RIGHTPADDING', (0, 0), (-1, -1), 16),
            ('TOPPADDING', (0, 0), (-1, -1), 16),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ]))
        
        story.append(items_table)
        story.append(Spacer(1, 20))
        
        # Totals section
        totals_data = [
            ['', 'Subtotal:', f"${invoice_data['subtotal']:.2f}"],
            ['', 'Tax (10%):', f"${invoice_data['tax']:.2f}"],
            ['', 'Total:', f"${invoice_data['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[4*inch, 1*inch, 1*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (1, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (1, 0), (-1, -1), 14),
            ('FONTNAME', (1, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (1, 2), (-1, 2), 16),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(totals_table)
        
        # Build PDF
        doc.build(story)
        return output_path

    def generate_stripe_invoice(self, invoice_data, output_path):
        """Generate Stripe-style invoice using ReportLab"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Centered title (Stripe style)
        title = Paragraph("Invoice", ParagraphStyle(
            'StripeTitle',
            parent=self.styles['Heading1'],
            fontSize=48,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Invoice number
        invoice_num = Paragraph(f"#{invoice_data['invoice_number']}", ParagraphStyle(
            'InvoiceNumber',
            parent=self.styles['Normal'],
            fontSize=18,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        story.append(invoice_num)
        story.append(Spacer(1, 40))
        
        # From/To section
        bill_data = [
            [
                Paragraph("FROM", ParagraphStyle(
                    'SectionLabel',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#374151'),
                    fontName='Helvetica-Bold',
                    textTransform='uppercase'
                )),
                Paragraph("TO", ParagraphStyle(
                    'SectionLabel',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#374151'),
                    fontName='Helvetica-Bold',
                    textTransform='uppercase'
                ))
            ],
            [
                Paragraph(f"<b>{invoice_data['company_name']}</b><br/>{invoice_data['company_email']}", 
                         self.styles['Normal']),
                Paragraph(f"<b>{invoice_data['client_name']}</b><br/>{invoice_data['client_email']}", 
                         self.styles['Normal'])
            ]
        ]
        
        bill_table = Table(bill_data, colWidths=[3*inch, 3*inch])
        bill_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
        ]))
        
        story.append(bill_table)
        story.append(Spacer(1, 40))
        
        # Items (Stripe style - no table, just items)
        for item in invoice_data['items']:
            item_para = Paragraph(
                f"<b>{item['description']}</b><br/>{item['quantity']} × ${item['rate']:.2f}",
                self.styles['Normal']
            )
            amount_para = Paragraph(f"${item['amount']:.2f}", ParagraphStyle(
                'ItemAmount',
                parent=self.styles['Normal'],
                fontSize=20,
                fontName='Helvetica-Bold',
                alignment=TA_RIGHT
            ))
            
            item_table = Table([[item_para, amount_para]], colWidths=[4*inch, 2*inch])
            item_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#f3f4f6')),
            ]))
            
            story.append(item_table)
        
        story.append(Spacer(1, 30))
        
        # Totals (right aligned)
        totals_data = [
            ['Subtotal', f"${invoice_data['subtotal']:.2f}"],
            ['Tax', f"${invoice_data['tax']:.2f}"],
            ['Total', f"${invoice_data['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[3*inch, 2*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -2), 'Helvetica'),
            ('FONTNAME', (0, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -2), 18),
            ('FONTSIZE', (0, 2), (-1, 2), 28),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LINEABOVE', (0, 2), (-1, 2), 2, colors.HexColor('#e5e7eb')),
        ]))
        
        story.append(totals_table)
        
        # Build PDF
        doc.build(story)
        return output_path

    def generate_invoicr_invoice(self, invoice_data, output_path):
        """Generate Invoicr-style invoice (red theme, Arial font)"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Header with red theme
        header_data = [
            [Paragraph("INVOICE", ParagraphStyle(
                'InvoicrTitle',
                parent=self.styles['Heading1'],
                fontSize=36,
                textColor=colors.HexColor('#dc2626'),  # Red-600
                spaceAfter=12,
                alignment=TA_LEFT,
                fontName='Helvetica-Bold'
            )), ""],
            [Paragraph(f"#{invoice_data['invoice_number']}", self.styles['Normal']), 
             f"Date: {invoice_data['date']}<br/>Due: {invoice_data['due_date']}"]
        ]
        
        header_table = Table(header_data, colWidths=[4*inch, 2*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 20))
        
        # Bill From/To section
        bill_data = [
            [
                Paragraph("BILL FROM", ParagraphStyle(
                    'SectionHeader',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#dc2626'),
                    fontName='Helvetica-Bold'
                )),
                Paragraph("BILL TO", ParagraphStyle(
                    'SectionHeader',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#dc2626'),
                    fontName='Helvetica-Bold'
                ))
            ],
            [
                Paragraph(f"<b>{invoice_data['company_name']}</b><br/>{invoice_data['company_email']}", 
                         self.styles['Normal']),
                Paragraph(f"<b>{invoice_data['client_name']}</b><br/>{invoice_data['client_email']}", 
                         self.styles['Normal'])
            ]
        ]
        
        bill_table = Table(bill_data, colWidths=[3*inch, 3*inch])
        bill_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(bill_table)
        story.append(Spacer(1, 30))
        
        # Items table with red header
        items_data = [['DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']]
        
        for item in invoice_data['items']:
            items_data.append([
                Paragraph(item['description'], self.styles['TableData']),
                Paragraph(str(item['quantity']), self.styles['TableData']),
                Paragraph(f"${item['rate']:.2f}", self.styles['TableData']),
                Paragraph(f"${item['amount']:.2f}", self.styles['TableData'])
            ])
        
        items_table = Table(items_data, colWidths=[3*inch, 0.8*inch, 1*inch, 1*inch])
        items_table.setStyle(TableStyle([
            # Header styling with red background
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (1, 0), (-1, 0), 'CENTER'),
            ('ALIGN', (2, 0), (-1, 0), 'RIGHT'),
            
            # Data styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 14),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
            
            # Borders and padding
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('LEFTPADDING', (0, 0), (-1, -1), 16),
            ('RIGHTPADDING', (0, 0), (-1, -1), 16),
            ('TOPPADDING', (0, 0), (-1, -1), 16),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ]))
        
        story.append(items_table)
        story.append(Spacer(1, 20))
        
        # Totals section
        totals_data = [
            ['', 'Subtotal:', f"${invoice_data['subtotal']:.2f}"],
            ['', 'Tax (10%):', f"${invoice_data['tax']:.2f}"],
            ['', 'Total:', f"${invoice_data['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[4*inch, 1*inch, 1*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (1, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (1, 0), (-1, -1), 14),
            ('FONTNAME', (1, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (1, 2), (-1, 2), 16),
            ('TEXTCOLOR', (1, 2), (-1, 2), colors.HexColor('#dc2626')),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(totals_table)
        
        # Build PDF
        doc.build(story)
        return output_path

    def generate_material_invoice(self, invoice_data, output_path):
        """Generate Material UI blue theme invoice"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Header with Material blue theme
        header_data = [
            [Paragraph("INVOICE", ParagraphStyle(
                'MaterialTitle',
                parent=self.styles['Heading1'],
                fontSize=32,
                textColor=colors.HexColor('#1976d2'),  # Material Blue
                spaceAfter=12,
                alignment=TA_LEFT,
                fontName='Helvetica-Bold'
            )), ""],
            [Paragraph(f"#{invoice_data['invoice_number']}", self.styles['Normal']), 
             f"Date: {invoice_data['date']}<br/>Due: {invoice_data['due_date']}"]
        ]
        
        header_table = Table(header_data, colWidths=[4*inch, 2*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 20))
        
        # Bill From/To section
        bill_data = [
            [
                Paragraph("BILL FROM", ParagraphStyle(
                    'SectionHeader',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#1976d2'),
                    fontName='Helvetica-Bold'
                )),
                Paragraph("BILL TO", ParagraphStyle(
                    'SectionHeader',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#1976d2'),
                    fontName='Helvetica-Bold'
                ))
            ],
            [
                Paragraph(f"<b>{invoice_data['company_name']}</b><br/>{invoice_data['company_email']}", 
                         self.styles['Normal']),
                Paragraph(f"<b>{invoice_data['client_name']}</b><br/>{invoice_data['client_email']}", 
                         self.styles['Normal'])
            ]
        ]
        
        bill_table = Table(bill_data, colWidths=[3*inch, 3*inch])
        bill_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(bill_table)
        story.append(Spacer(1, 30))
        
        # Items table with Material blue header
        items_data = [['DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']]
        
        for item in invoice_data['items']:
            items_data.append([
                Paragraph(item['description'], self.styles['TableData']),
                Paragraph(str(item['quantity']), self.styles['TableData']),
                Paragraph(f"${item['rate']:.2f}", self.styles['TableData']),
                Paragraph(f"${item['amount']:.2f}", self.styles['TableData'])
            ])
        
        items_table = Table(items_data, colWidths=[3*inch, 0.8*inch, 1*inch, 1*inch])
        items_table.setStyle(TableStyle([
            # Header styling with Material blue background
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1976d2')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (1, 0), (-1, 0), 'CENTER'),
            ('ALIGN', (2, 0), (-1, 0), 'RIGHT'),
            
            # Data styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 14),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
            
            # Borders and padding
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('LEFTPADDING', (0, 0), (-1, -1), 16),
            ('RIGHTPADDING', (0, 0), (-1, -1), 16),
            ('TOPPADDING', (0, 0), (-1, -1), 16),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ]))
        
        story.append(items_table)
        story.append(Spacer(1, 20))
        
        # Totals section
        totals_data = [
            ['', 'Subtotal:', f"${invoice_data['subtotal']:.2f}"],
            ['', 'Tax (10%):', f"${invoice_data['tax']:.2f}"],
            ['', 'Total:', f"${invoice_data['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[4*inch, 1*inch, 1*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (1, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (1, 0), (-1, -1), 14),
            ('FONTNAME', (1, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (1, 2), (-1, 2), 16),
            ('TEXTCOLOR', (1, 2), (-1, 2), colors.HexColor('#1976d2')),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(totals_table)
        
        # Build PDF
        doc.build(story)
        return output_path

    def generate_bootstrap_invoice(self, invoice_data, output_path):
        """Generate Bootstrap 5 blue theme invoice"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Header with Bootstrap blue theme
        header_data = [
            [Paragraph("INVOICE", ParagraphStyle(
                'BootstrapTitle',
                parent=self.styles['Heading1'],
                fontSize=32,
                textColor=colors.HexColor('#0d6efd'),  # Bootstrap Blue
                spaceAfter=12,
                alignment=TA_LEFT,
                fontName='Helvetica-Bold'
            )), ""],
            [Paragraph(f"#{invoice_data['invoice_number']}", self.styles['Normal']), 
             f"Date: {invoice_data['date']}<br/>Due: {invoice_data['due_date']}"]
        ]
        
        header_table = Table(header_data, colWidths=[4*inch, 2*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 20))
        
        # Bill From/To section
        bill_data = [
            [
                Paragraph("BILL FROM", ParagraphStyle(
                    'SectionHeader',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#0d6efd'),
                    fontName='Helvetica-Bold'
                )),
                Paragraph("BILL TO", ParagraphStyle(
                    'SectionHeader',
                    parent=self.styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#0d6efd'),
                    fontName='Helvetica-Bold'
                ))
            ],
            [
                Paragraph(f"<b>{invoice_data['company_name']}</b><br/>{invoice_data['company_email']}", 
                         self.styles['Normal']),
                Paragraph(f"<b>{invoice_data['client_name']}</b><br/>{invoice_data['client_email']}", 
                         self.styles['Normal'])
            ]
        ]
        
        bill_table = Table(bill_data, colWidths=[3*inch, 3*inch])
        bill_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(bill_table)
        story.append(Spacer(1, 30))
        
        # Items table with Bootstrap blue header
        items_data = [['DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']]
        
        for item in invoice_data['items']:
            items_data.append([
                Paragraph(item['description'], self.styles['TableData']),
                Paragraph(str(item['quantity']), self.styles['TableData']),
                Paragraph(f"${item['rate']:.2f}", self.styles['TableData']),
                Paragraph(f"${item['amount']:.2f}", self.styles['TableData'])
            ])
        
        items_table = Table(items_data, colWidths=[3*inch, 0.8*inch, 1*inch, 1*inch])
        items_table.setStyle(TableStyle([
            # Header styling with Bootstrap blue background
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0d6efd')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (1, 0), (-1, 0), 'CENTER'),
            ('ALIGN', (2, 0), (-1, 0), 'RIGHT'),
            
            # Data styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 14),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
            
            # Borders and padding
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('LEFTPADDING', (0, 0), (-1, -1), 16),
            ('RIGHTPADDING', (0, 0), (-1, -1), 16),
            ('TOPPADDING', (0, 0), (-1, -1), 16),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ]))
        
        story.append(items_table)
        story.append(Spacer(1, 20))
        
        # Totals section
        totals_data = [
            ['', 'Subtotal:', f"${invoice_data['subtotal']:.2f}"],
            ['', 'Tax (10%):', f"${invoice_data['tax']:.2f}"],
            ['', 'Total:', f"${invoice_data['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[4*inch, 1*inch, 1*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (1, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (1, 0), (-1, -1), 14),
            ('FONTNAME', (1, 2), (-1, 2), 'Helvetica-Bold'),
            ('FONTSIZE', (1, 2), (-1, 2), 16),
            ('TEXTCOLOR', (1, 2), (-1, 2), colors.HexColor('#0d6efd')),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(totals_table)
        
        # Build PDF
        doc.build(story)
        return output_path

def generate_sample_invoice():
    """Generate sample invoice for testing"""
    
    sample_data = {
        'invoice_number': 'INV-20241201-001',
        'date': '2024-12-01',
        'due_date': '2024-12-15',
        'company_name': 'Your Company',
        'company_email': 'your@company.com',
        'client_name': 'John Doe',
        'client_email': 'john@example.com',
        'items': [
            {'description': 'Web Development Services', 'quantity': 40, 'rate': 75.00, 'amount': 3000.00},
            {'description': 'UI/UX Design', 'quantity': 20, 'rate': 100.00, 'amount': 2000.00}
        ],
        'subtotal': 5000.00,
        'tax': 500.00,
        'total': 5500.00
    }
    
    generator = InvoiceGenerator()
    
    # Generate Manta-style invoice
    manta_output = generator.generate_manta_invoice(sample_data, 'manta_invoice.pdf')
    print(f"Manta invoice generated: {manta_output}")
    
    # Generate Stripe-style invoice
    stripe_output = generator.generate_stripe_invoice(sample_data, 'stripe_invoice.pdf')
    print(f"Stripe invoice generated: {stripe_output}")

if __name__ == "__main__":
    generate_sample_invoice()




