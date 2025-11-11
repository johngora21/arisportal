"""
ClickPesa Service Wrapper
Wraps ClickPesa API calls in the PaymentProviderInterface
"""
from typing import Dict, Optional
from services.payment_provider import PaymentProviderInterface
from routers.clickpesa import get_clickpesa_token
import httpx
import time

class ClickPesaService(PaymentProviderInterface):
    """ClickPesa API wrapper for local Tanzania payments"""
    
    def __init__(self):
        self.base_url = "https://api.clickpesa.com"
    
    def create_transfer(self, amount: float, currency: str, recipient: Dict, reference: str) -> Dict:
        """
        Create a payment via ClickPesa BillPay
        
        Args:
            amount: Payment amount
            currency: Currency (TZS for Tanzania)
            recipient: Recipient details {
                'name': str,
                'phone': str,
                'email': Optional[str]
            }
            reference: Transaction reference
            
        Returns:
            Payment details including control number
        """
        try:
            token = get_clickpesa_token()
            
            billpay_request = {
                "customerName": recipient.get('name'),
                "billDescription": recipient.get('description', 'Payment'),
                "billPaymentMode": "ALLOW_PARTIAL_AND_OVER_PAYMENT",
                "billAmount": amount,
                "billReference": reference
            }
            
            if recipient.get('phone'):
                billpay_request["customerPhone"] = recipient['phone']
            if recipient.get('email'):
                billpay_request["customerEmail"] = recipient['email']
            
            response = httpx.post(
                f"{self.base_url}/third-parties/billpay/create-customer-control-number",
                headers={
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                json=billpay_request,
                timeout=10.0
            )
            response.raise_for_status()
            billpay_response = response.json()
            
            return {
                'transfer_id': billpay_response.get('billPayNumber'),
                'status': 'pending',
                'reference': reference,
                'amount': amount,
                'currency': currency,
                'recipient': recipient.get('name'),
                'provider': 'CLICKPESA',
                'control_number': billpay_response.get('billPayNumber')
            }
        except Exception as e:
            raise Exception(f"ClickPesa error: {str(e)}")
    
    def get_transfer_status(self, transfer_id: str) -> Dict:
        """Get status of a ClickPesa transaction"""
        # ClickPesa status is typically handled via webhook
        # This would require querying your database for the transaction
        return {
            'transfer_id': transfer_id,
            'status': 'pending',
            'provider': 'CLICKPESA',
            'note': 'Status is updated via webhook'
        }
    
    def get_balance(self, currency: Optional[str] = None) -> Dict:
        """Get ClickPesa balance (if API supports it)"""
        # ClickPesa may not have a direct balance API
        # This would need to be implemented based on your account structure
        return {
            'currency': currency or 'TZS',
            'balance': 0.0,
            'provider': 'CLICKPESA',
            'note': 'Balance tracking via transactions'
        }
    
    def validate_recipient(self, recipient: Dict) -> bool:
        """Validate recipient details for ClickPesa"""
        required_fields = ['name', 'phone']
        return all(field in recipient for field in required_fields)

    def disburse_mobile_money(self, amount: float, currency: str, *, phone: str, recipient_name: str, mno_id: str, reference: str, description: Optional[str] = None) -> Dict:
        """
        Disburse funds from ClickPesa pool to a Tanzanian mobile wallet.

        Args:
            amount: Amount to send
            currency: Currency code, e.g., 'TZS'
            phone: MSISDN (e.g., 2557XXXXXXXX)
            recipient_name: Recipient display name
            mno_id: One of 'vodacom' | 'airtel' | 'tigo' | 'halotel' | 'ttcl'
            reference: Unique payout reference
            description: Optional description

        Returns: Provider response dict (includes provider reference/status)
        """
        channel_map = {
            'vodacom': 'MPESA_TZ',
            'airtel': 'AIRTEL_TZ',
            'tigo': 'TIGO_TZ',
            'halotel': 'HALOPESA_TZ',
            'ttcl': 'TTCL_TZ',
        }

        channel = channel_map.get(mno_id)
        if not channel:
            raise Exception(f"Unsupported MNO: {mno_id}")

        token = get_clickpesa_token()

        payload = {
            "paymentMode": "MOBILE_MONEY",
            "channel": channel,
            "amount": amount,
            "currency": currency,
            "customerName": recipient_name,
            "customerPhone": phone,
            "externalReference": reference,
            "description": description or f"Payout to {recipient_name}"
        }

        try:
            print(f"[ClickPesa DISBURSE] POST payload={payload}")
            auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
            res = httpx.post(
                f"{self.base_url}/third-parties/payments/disbursements",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa DISBURSE] status_code={res.status_code} body={body}")
            return {
                'status': body.get('status') or 'PROCESSING',
                'provider': 'CLICKPESA',
                'provider_reference': body.get('reference') or body.get('transactionId') or reference,
                'request': payload,
                'response': body
            }
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa DISBURSE][ERROR] {err}")
            raise Exception(f"ClickPesa disbursement failed: {err}")

    def create_mobile_money_payout(self, *, amount: float, currency: str, phone_number: str, order_reference: str, checksum: Optional[str] = None) -> Dict:
        """
        Preferred: Create Mobile Money Payout via ClickPesa payouts API.
        Mirrors docs: POST /third-parties/payouts/create-mobile-money-payout
        """
        token = get_clickpesa_token()
        payload = {
            "amount": amount,
            "phoneNumber": phone_number,
            "currency": currency,
            "orderReference": order_reference,
        }
        if checksum:
            payload["checksum"] = checksum

        try:
            print(f"[ClickPesa PAYOUT] POST payload={payload}")
            auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
            res = httpx.post(
                f"{self.base_url}/third-parties/payouts/create-mobile-money-payout",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa PAYOUT] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa PAYOUT][ERROR] {err}")
            raise Exception(f"ClickPesa payout failed: {err}")

    def get_mobile_money_payout(self, payout_id: str, *, timeout_seconds: float = 20.0) -> Dict:
        """Fetch payout details by ClickPesa payout ID"""
        token = get_clickpesa_token()
        auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
        try:
            res = httpx.get(
                f"{self.base_url}/third-parties/payouts/{payout_id}",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                timeout=timeout_seconds
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa PAYOUT STATUS] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa PAYOUT STATUS][ERROR] {err}")
            raise Exception(f"ClickPesa payout status failed: {err}")

    def poll_mobile_money_payout_success(self, payout_id: str, *, max_attempts: int = 5, interval_seconds: float = 2.0) -> Dict:
        """
        Poll ClickPesa payout status endpoint until SUCCESS/REVERSED or attempts exhausted.
        Returns the last payload received.
        """
        last_payload: Dict = {}
        for attempt in range(max_attempts):
            try:
                payload = self.get_mobile_money_payout(payout_id)
                last_payload = payload
                status = (payload.get('status') or "").upper()
                print(f"[ClickPesa PAYOUT POLL] attempt={attempt+1} status={status}")
                if status in ["SUCCESS", "REVERSED"]:
                    return payload
            except Exception as exc:
                print(f"[ClickPesa PAYOUT POLL][WARN] attempt={attempt+1} error={exc}")
                last_payload = {"status": "ERROR", "error": str(exc)}
            time.sleep(interval_seconds)
        return last_payload

