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
        # Check if credentials are set
        if not CLICKPESA_API_KEY or not CLICKPESA_CLIENT_ID:
            raise Exception("ClickPesa API credentials not configured. Please set CLICKPESA_API_KEY and CLICKPESA_CLIENT_ID environment variables.")
        
        print(f"🔐 Requesting ClickPesa token from: {CLICKPESA_BASE_URL}/third-parties/generate-token")
        print(f"🔑 Using API Key: {CLICKPESA_API_KEY[:10]}... (hidden)")
        print(f"🔑 Using Client ID: {CLICKPESA_CLIENT_ID[:10]}... (hidden)")
        
        response = httpx.post(
            f"{CLICKPESA_BASE_URL}/third-parties/generate-token",
            headers={
                'api-key': CLICKPESA_API_KEY,
                'client-id': CLICKPESA_CLIENT_ID
            },
            timeout=30.0
        )
        
        print(f"📡 Token response status: {response.status_code}")
        
        try:
        response.raise_for_status()
        except httpx.HTTPStatusError as e:
            error_body = {}
            try:
                error_body = e.response.json()
            except:
                error_body = {'text': e.response.text}
            raise Exception(f"ClickPesa token API returned {e.response.status_code}: {error_body}")
        
        data = response.json()
        print(f"📦 Token response data: {data}")
        
        # Try multiple possible response formats
        token = (
            data.get('token') or
            data.get('data', {}).get('token') or
            data.get('access_token') or
            data.get('data', {}).get('access_token') or
            (data.get('data') if isinstance(data.get('data'), str) else None)
        )
        
        if token:
            print(f"✅ ClickPesa token obtained successfully: {token[:20]}... (hidden)")
            return token
        else:
            error_msg = f"ClickPesa token response did not contain a token. Response: {data}"
            print(f"❌ {error_msg}")
            raise Exception(error_msg)
            
    except Exception as e:
        error_msg = f"Error getting ClickPesa token: {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
