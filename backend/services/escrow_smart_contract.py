"""
Escrow Smart Contract Service
Handles blockchain smart contract deployment for escrow accounts
"""

import os
from typing import Dict

from dotenv import load_dotenv
import json
from pathlib import Path

try:
    from web3 import Web3

    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    Web3 = None
    print("⚠️ web3 not available - running in mock mode")

load_dotenv()


class EscrowSmartContract:
    """
    Manages smart contract deployment and interaction for escrow accounts.
    """
    
    def __init__(self):
        """Initialize the smart contract service."""
        if not WEB3_AVAILABLE:
            print("⚠️ web3 not available - running in mock mode")
            self.web3 = None
            self.contract_address = None
            self.private_key = None
            self.is_configured = False
            self.contract = None
            self.abi = None
            self.account = None
            self.chain_id = None
            self.contract_address_checksum = None
        else:
            # Initialize Web3 connection from environment variables
            blockchain_rpc_url = os.getenv("BLOCKCHAIN_RPC_URL", "")
            self.contract_address = os.getenv("CONTRACT_ADDRESS", "")
            self.private_key = os.getenv("WALLET_PRIVATE_KEY", "")
            
            if blockchain_rpc_url:
                try:
                    self.web3 = Web3(Web3.HTTPProvider(blockchain_rpc_url))
                    if self.web3.is_connected():
                        self.chain_id = self.web3.eth.chain_id
                        expected_chain_id = os.getenv("CHAIN_ID")
                        if expected_chain_id:
                            try:
                                expected_chain_id_int = int(expected_chain_id)
                                if expected_chain_id_int != self.chain_id:
                                    print(f"⚠️ Chain ID mismatch: expected {expected_chain_id_int}, got {self.chain_id}")
                            except ValueError:
                                print("⚠️ CHAIN_ID environment variable is not a valid integer")

                        try:
                            if self.contract_address:
                                self.contract_address_checksum = self.web3.to_checksum_address(self.contract_address)
                        except Exception as checksum_error:
                            print(f"⚠️ Invalid CONTRACT_ADDRESS: {checksum_error}")
                            self.contract_address_checksum = None

                        try:
                            if self.private_key:
                                self.account = self.web3.eth.account.from_key(self.private_key)
                        except Exception as key_error:
                            print(f"⚠️ Invalid WALLET_PRIVATE_KEY: {key_error}")
                            self.account = None

                        if self.contract_address_checksum and self.account:
                            if self._load_contract():
                                print(f"✅ Web3 connected to blockchain (Chain ID: {self.chain_id})")
                                self.is_configured = True
                            else:
                                print("⚠️ Failed to load contract ABI - running in mock mode")
                                self.is_configured = False
                        else:
                            print("⚠️ Web3 connected but CONTRACT_ADDRESS or WALLET_PRIVATE_KEY not set/invalid - release will not be recorded on-chain")
                            self.is_configured = False

                    else:
                        print("⚠️ Web3 connection failed - running in mock mode")
                        self.web3 = None
                        self.is_configured = False
                except Exception as e:
                    print(f"⚠️ Web3 initialization error: {str(e)} - running in mock mode")
                    self.web3 = None
                    self.is_configured = False
            else:
                print("⚠️ BLOCKCHAIN_RPC_URL not set - running in mock mode")
                self.web3 = None
                self.is_configured = False
    
    def deploy_escrow_contract(self, escrow_id: str, total_amount: float, currency: str = "TZS") -> Dict:
        """
        Deploy a new escrow smart contract
        
        Args:
            escrow_id: Unique escrow identifier
            total_amount: Total amount to be held in escrow
            currency: Currency code (default: TZS)
            
        Returns:
            Dict with success status and contract address
        """
        try:
            # For now, return mock response
            # TODO: Implement actual smart contract deployment
            print(f"📝 Mock deploying escrow contract for {escrow_id} with amount {total_amount}")
            
            return {
                "success": True,
                "contract_address": f"0x{escrow_id[:40]}",  # Mock address
                "transaction_hash": f"0x{escrow_id[:64]}",  # Mock hash
                "block_number": 12345,  # Mock block
                "message": "Mock contract deployed (web3 not available)"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def record_deposit(self, escrow_id: str, amount: float, transaction_hash: str) -> Dict:
        """
        Record a deposit to the escrow contract
        
        Args:
            escrow_id: Unique escrow identifier
            amount: Deposit amount
            transaction_hash: Blockchain transaction hash
            
        Returns:
            Dict with transaction hash
        """
        try:
            print(f"📝 Mock recording deposit for escrow {escrow_id}: {amount}")
            
            return {
                "success": True,
                "transaction_hash": transaction_hash,
                "block_number": 12346,
                "message": "Mock deposit recorded (web3 not available)"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _load_contract(self) -> bool:
        """Load contract ABI and initialise contract instance."""
        abi_path_env = os.getenv("ESCROW_CONTRACT_ABI_PATH")
        if abi_path_env:
            abi_path = Path(abi_path_env)
        else:
            base_dir = Path(__file__).resolve().parent
            abi_path = base_dir / ".." / "blockchain" / "blockchain" / "artifacts" / "contracts" / "EscrowContract.sol" / "EscrowContract.json"
            abi_path = abi_path.resolve()

        if not abi_path.exists():
            print(f"⚠️ Escrow contract ABI not found at {abi_path}")
            return False

        try:
            with open(abi_path, "r", encoding="utf-8") as abi_file:
                artifact = json.load(abi_file)
                abi = artifact.get("abi")
                if not abi:
                    print("⚠️ ABI not found in contract artifact")
                    return False
                self.abi = abi
        except Exception as abi_error:
            print(f"⚠️ Failed to load contract ABI: {abi_error}")
            return False

        try:
            self.contract = self.web3.eth.contract(address=self.contract_address_checksum, abi=self.abi)
            return True
        except Exception as contract_error:
            print(f"⚠️ Failed to create contract instance: {contract_error}")
            return False

    def _normalise_escrow_id(self, escrow_id: str) -> int:
        """Convert application escrow ID (e.g. ESC-001) to numeric ID used on-chain."""
        if isinstance(escrow_id, int):
            return escrow_id
        if not escrow_id:
            raise ValueError("Escrow ID is required")
        if isinstance(escrow_id, str):
            cleaned = ''.join(ch for ch in escrow_id if ch.isdigit())
            if not cleaned:
                raise ValueError(f"Cannot derive numeric escrow ID from {escrow_id}")
            return int(cleaned)
        raise ValueError(f"Unsupported escrow_id type: {type(escrow_id)}")
    
    def release_payment(self, escrow_id: str, amount: float, payee_address: str) -> Dict:
        """
        Record escrow release on blockchain for audit trail.
        
        This creates an immutable record that escrow funds were released.
        The actual payment happens via ClickPesa - this is just for audit/logging.
        
        Args:
            escrow_id: Unique escrow identifier (e.g., "ESC-001")
            amount: Amount that was released
            payee_address: Recipient blockchain address (optional, can be empty string)
            
        Returns:
            Dict with transaction hash, block number, and status
        """
        try:
            if not self.is_configured or not self.web3 or not self.web3.is_connected() or not self.contract or not self.account:
                return {
                    "success": False,
                    "error": "web3 provider not configured. Set BLOCKCHAIN_RPC_URL, CONTRACT_ADDRESS, WALLET_PRIVATE_KEY, and ensure ESCROW_CONTRACT_ABI_PATH points to valid ABI in .env"
                }

            # Normalize escrow ID to numeric (extract number from "ESC-001" -> 1)
            try:
                contract_escrow_id = self._normalise_escrow_id(escrow_id)
            except ValueError as normalise_error:
                return {
                    "success": False,
                    "error": f"Invalid escrow ID format: {normalise_error}"
                }

            # Validate payee address if provided
            payee_checksum = None
            if payee_address and payee_address.strip():
                try:
                    payee_checksum = self.web3.to_checksum_address(payee_address.strip())
                except Exception as addr_error:
                    print(f"⚠️ Invalid payee address '{payee_address}': {addr_error}. Proceeding without address validation.")
                    payee_checksum = None

            # Check if escrow exists on-chain before attempting release
            # If escrow doesn't exist, we'll create a simple event log instead
            escrow_exists = False
            try:
                # Try to read escrow data - if it exists, escrowId will be > 0
                escrow_data = self.contract.functions.escrows(contract_escrow_id).call()
                # escrowId is the first field in the Escrow struct
                if isinstance(escrow_data, tuple) and len(escrow_data) > 0:
                    escrow_exists = escrow_data[0] > 0
                elif isinstance(escrow_data, dict) and 'escrowId' in escrow_data:
                    escrow_exists = escrow_data['escrowId'] > 0
            except Exception as check_error:
                # If call fails, escrow likely doesn't exist
                error_str = str(check_error).lower()
                if "revert" in error_str or "does not exist" in error_str:
                    escrow_exists = False
                else:
                    print(f"⚠️ Could not check escrow existence on-chain: {check_error}")
                    escrow_exists = False

            if escrow_exists:
                # Escrow exists on-chain - call releasePayment function
                print(f"📝 Escrow {escrow_id} (ID: {contract_escrow_id}) exists on-chain. Calling releasePayment...")
                
                function = self.contract.functions.releasePayment(contract_escrow_id)
                
                try:
                    gas_estimate = function.estimate_gas({
                        "from": self.account.address
                    })
                    # Add 20% buffer for gas
                    gas_estimate = int(gas_estimate * 1.2)
                except Exception as gas_error:
                    error_msg = str(gas_error)
                    if "revert" in error_msg.lower() or "execution reverted" in error_msg.lower():
                        return {
                            "success": False,
                            "error": f"Contract release failed: {error_msg}. Escrow may not be in Active status or release conditions not met."
                        }
                    print(f"⚠️ Gas estimation failed: {gas_error}. Using default gas limit")
                    gas_estimate = 500000

                nonce = self.web3.eth.get_transaction_count(self.account.address, 'pending')
                gas_price = self.web3.eth.gas_price
                
                # For Polygon, use EIP-1559 if available, otherwise legacy
                try:
                    latest_block = self.web3.eth.get_block('latest')
                    if 'baseFeePerGas' in latest_block:
                        # EIP-1559 transaction
                        try:
                            max_priority_fee = self.web3.eth.max_priority_fee
                        except:
                            # Fallback priority fee (1 gwei)
                            max_priority_fee = self.web3.to_wei(1, 'gwei')
                        
                        max_fee_per_gas = max_priority_fee + (latest_block['baseFeePerGas'] * 2)
                        transaction = function.build_transaction({
                            "from": self.account.address,
                            "nonce": nonce,
                            "maxFeePerGas": max_fee_per_gas,
                            "maxPriorityFeePerGas": max_priority_fee,
                            "gas": gas_estimate,
                            "chainId": self.chain_id or self.web3.eth.chain_id
                        })
                    else:
                        # Legacy transaction
                        transaction = function.build_transaction({
                            "from": self.account.address,
                            "nonce": nonce,
                            "gas": gas_estimate,
                            "gasPrice": gas_price,
                            "chainId": self.chain_id or self.web3.eth.chain_id
                        })
                except Exception as fee_error:
                    # Fallback to legacy
                    print(f"⚠️ EIP-1559 not available, using legacy gas: {fee_error}")
                    transaction = function.build_transaction({
                        "from": self.account.address,
                        "nonce": nonce,
                        "gas": gas_estimate,
                        "gasPrice": gas_price,
                        "chainId": self.chain_id or self.web3.eth.chain_id
                    })

                signed_txn = self.web3.eth.account.sign_transaction(transaction, private_key=self.private_key)
                tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
                
                print(f"⏳ Transaction sent: {tx_hash.hex()}. Waiting for confirmation...")
                
                # Wait for transaction receipt with timeout
                receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

                success = receipt.status == 1

                if success:
                    print(f"✅ Escrow release recorded on blockchain: {tx_hash.hex()} (Block: {receipt.blockNumber})")
                else:
                    print(f"❌ Transaction failed: {tx_hash.hex()}")

                return {
                    "success": success,
                    "transaction_hash": tx_hash.hex(),
                    "block_number": receipt.blockNumber,
                    "gas_used": receipt.gasUsed,
                    "message": "Escrow release recorded on blockchain" if success else "Transaction reverted on-chain"
                }
            else:
                # Escrow doesn't exist on-chain - create a simple event log transaction
                # We'll use a generic event or create a minimal transaction
                print(f"📝 Escrow {escrow_id} (ID: {contract_escrow_id}) not found on-chain. Creating audit log transaction...")
                
                # Create a simple transaction that just records the release event
                # This is a fallback when escrows aren't created on-chain
                # In production, you might want to create escrows on-chain when they're created in DB
                
                # For now, we'll create a minimal transaction that can be verified
                # Option 1: Call a logging function if contract has one
                # Option 2: Create a simple transfer to ourselves (0 value) with data
                # Option 3: Use contract's event emission if available
                
                # Since we don't have a dedicated logging function, we'll create a simple transaction
                # that records the release in the transaction data
                nonce = self.web3.eth.get_transaction_count(self.account.address, 'pending')
                gas_price = self.web3.eth.gas_price
                
                # Create a transaction with data encoding the release info
                release_data = self.web3.keccak(
                    text=f"ESCROW_RELEASE:{escrow_id}:{amount}:{payee_address or 'N/A'}"
                ).hex()
                
                transaction = {
                    "from": self.account.address,
                    "to": self.contract_address_checksum,  # Send to contract address
                    "value": 0,  # No value transfer
                    "data": release_data[:10],  # Function selector or data
                    "nonce": nonce,
                    "gas": 21000,  # Minimum gas for simple transaction
                    "gasPrice": gas_price,
                    "chainId": self.chain_id or self.web3.eth.chain_id
                }
                
                signed_txn = self.web3.eth.account.sign_transaction(transaction, private_key=self.private_key)
                tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
                
                print(f"⏳ Audit log transaction sent: {tx_hash.hex()}. Waiting for confirmation...")
                
                receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
                
                success = receipt.status == 1
                
                if success:
                    print(f"✅ Escrow release audit log recorded: {tx_hash.hex()} (Block: {receipt.blockNumber})")
                else:
                    print(f"❌ Audit log transaction failed: {tx_hash.hex()}")
            
            return {
                    "success": success,
                    "transaction_hash": tx_hash.hex(),
                    "block_number": receipt.blockNumber,
                    "gas_used": receipt.gasUsed,
                    "message": "Escrow release audit log recorded on blockchain" if success else "Audit log transaction failed",
                    "note": "Escrow not found on-chain - this is an audit log only"
                }
                
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error recording escrow release on blockchain: {error_msg}")
            
            # Provide more helpful error messages
            if "insufficient funds" in error_msg.lower() or "balance" in error_msg.lower():
                return {
                    "success": False,
                    "error": f"Insufficient funds for gas: {error_msg}. Ensure wallet has ETH/MATIC for transaction fees."
                }
            elif "nonce" in error_msg.lower():
                return {
                    "success": False,
                    "error": f"Transaction nonce error: {error_msg}. This usually resolves on retry."
                }
            elif "revert" in error_msg.lower() or "execution reverted" in error_msg.lower():
                return {
                    "success": False,
                    "error": f"Contract execution reverted: {error_msg}. Check escrow status and contract conditions."
                }
            else:
                return {
                    "success": False,
                    "error": f"Blockchain transaction failed: {error_msg}"
                }
    
    def cancel_escrow(self, escrow_id: str) -> Dict:
        """
        Cancel escrow and return funds to depositor
        
        Args:
            escrow_id: Unique escrow identifier
            
        Returns:
            Dict with transaction hash
        """
        try:
            print(f"📝 Mock canceling escrow {escrow_id}")
            
            return {
                "success": True,
                "transaction_hash": f"0x{escrow_id[:64]}",
                "block_number": 12348,
                "message": "Mock escrow canceled (web3 not available)"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Create a singleton instance
escrow_smart_contract = EscrowSmartContract()

