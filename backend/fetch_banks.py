#!/usr/bin/env python3
"""Quick script to fetch ClickPesa banks list"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from services.clickpesa_service import ClickPesaService
import json

try:
    service = ClickPesaService()
    banks = service.get_banks_list()
    print(json.dumps(banks, indent=2))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

