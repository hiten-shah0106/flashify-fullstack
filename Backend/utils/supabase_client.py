# /utils/supabase_client.py
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_from_token(token):
    try:
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            return user_response.user, None
        return None, "Invalid token"
    except Exception as e:
        return None, str(e)
