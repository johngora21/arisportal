import os
import httpx
from dotenv import load_dotenv

load_dotenv()

CLICKPESA_API_KEY = os.getenv('CLICKPESA_API_KEY')
CLICKPESA_CLIENT_ID = os.getenv('CLICKPESA_CLIENT_ID')
CLICKPESA_BASE_URL = "https://api.clickpesa.com"

def get_clickpesa_token():
    """Generate and return ClickPesa access token"""
    try:
        response = httpx.post(
            f"{CLICKPESA_BASE_URL}/third-parties/generate-token",
            headers={
                'api-key': CLICKPESA_API_KEY,
                'client-id': CLICKPESA_CLIENT_ID
            },
            timeout=10.0
        )
        response.raise_for_status()
        data = response.json()
        if data.get('success') and 'token' in data:
            return data['token']
        else:
            raise Exception("Failed to get ClickPesa token")
    except Exception as e:
        raise Exception(f"Error getting token: {str(e)}")
