import os
import requests
from dotenv import load_dotenv

load_dotenv()

CLICKPESA_API_KEY = os.getenv('CLICKPESA_API_KEY')
CLICKPESA_CLIENT_ID = os.getenv('CLICKPESA_CLIENT_ID')
CLICKPESA_BASE_URL = "https://api.clickpesa.com"

def get_clickpesa_token():
    """Generate and return ClickPesa access token"""
    try:
        # Use simple requests.post() like cards.py does (but with requests instead of httpx)
        response = requests.post(
            f"{CLICKPESA_BASE_URL}/third-parties/generate-token",
            headers={
                'api-key': CLICKPESA_API_KEY,
                'client-id': CLICKPESA_CLIENT_ID
            },
            timeout=10.0
        )
        response.raise_for_status()
        data = response.json()
        
        # Try multiple response formats
        token = (
            data.get('token') or
            data.get('data', {}).get('token') or
            (data.get('data') if isinstance(data.get('data'), str) else None)
        )
        
        if token:
            return token
        elif data.get('success') and 'token' in data:
            return data['token']
        else:
            raise Exception(f"Failed to get ClickPesa token. Response: {data}")
    except Exception as e:
        raise Exception(f"Error getting token: {str(e)}")
