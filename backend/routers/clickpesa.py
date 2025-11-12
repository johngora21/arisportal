import os
import httpx
from dotenv import load_dotenv

load_dotenv()

CLICKPESA_API_KEY = os.getenv('CLICKPESA_API_KEY')
CLICKPESA_CLIENT_ID = os.getenv('CLICKPESA_CLIENT_ID')
CLICKPESA_BASE_URL = "https://api.clickpesa.com"

# Shared httpx client with connection pooling
_http_client = None

def get_http_client():
    """Get or create shared httpx client with connection pooling"""
    global _http_client
    if _http_client is None:
        timeout = httpx.Timeout(120.0, connect=30.0)
        _http_client = httpx.Client(
            timeout=timeout,
            follow_redirects=True,
            limits=httpx.Limits(max_keepalive_connections=10, max_connections=20)
        )
    return _http_client

def get_clickpesa_token():
    """Generate and return ClickPesa access token"""
    # Check if credentials are set
    if not CLICKPESA_API_KEY or not CLICKPESA_CLIENT_ID:
        raise Exception("ClickPesa API credentials not configured. Please set CLICKPESA_API_KEY and CLICKPESA_CLIENT_ID environment variables.")
    
    print(f"🔐 Requesting ClickPesa token from: {CLICKPESA_BASE_URL}/third-parties/generate-token")
    print(f"🔑 Using API Key: {CLICKPESA_API_KEY[:10]}... (hidden)")
    print(f"🔑 Using Client ID: {CLICKPESA_CLIENT_ID[:10]}... (hidden)")
    
    # Retry logic for connection issues
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Use shared httpx client with connection pooling
            client = get_http_client()
            response = client.post(
                f"{CLICKPESA_BASE_URL}/third-parties/generate-token",
                headers={
                    'api-key': CLICKPESA_API_KEY,
                    'client-id': CLICKPESA_CLIENT_ID
                }
            )
            break  # Success, exit retry loop
        except (httpx.ConnectError, httpx.ReadError, httpx.WriteError, httpx.PoolTimeout) as e:
            if attempt < max_retries - 1:
                print(f"⚠️ Connection error on attempt {attempt + 1}/{max_retries}: {str(e)}. Retrying...")
                import time
                time.sleep(1)  # Wait 1 second before retry
                continue
            else:
                raise Exception(f"Error getting ClickPesa token: Failed after {max_retries} attempts. Last error: {str(e)}")
    
    try:
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
            
    except httpx.TimeoutException as e:
        error_msg = f"Error getting ClickPesa token: Request timed out after 120 seconds. ClickPesa API may be slow or unavailable."
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
    except (httpx.ConnectError, httpx.ReadError, httpx.WriteError, httpx.PoolTimeout) as e:
        error_msg = f"Error getting ClickPesa token: Connection error - {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
    except Exception as e:
        error_msg = f"Error getting ClickPesa token: {str(e)}"
        print(f"❌ {error_msg}")
        raise Exception(error_msg)
