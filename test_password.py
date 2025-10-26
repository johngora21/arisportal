#!/usr/bin/env python3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test the stored hash
stored_hash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K"
test_password = "password123"

# Verify the password
is_valid = pwd_context.verify(test_password, stored_hash)
print(f"Password 'password123' matches stored hash: {is_valid}")

# Generate a new hash for password123
new_hash = pwd_context.hash("password123")
print(f"New hash for 'password123': {new_hash}")

# Test some other common passwords
common_passwords = ["password", "123456", "admin", "test", "Password123"]
for pwd in common_passwords:
    if pwd_context.verify(pwd, stored_hash):
        print(f"Found matching password: {pwd}")
        break
else:
    print("No common password matches the stored hash")
