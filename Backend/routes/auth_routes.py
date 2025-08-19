# /routes/auth_routes.py
from flask import Blueprint, request, jsonify
from utils.supabase_client import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400
    
    try:
        res = supabase.auth.sign_up({"email": email, "password": password})
        # Convert to dict for JSON serialization
        return jsonify({
            "user": res.user.model_dump() if res.user else None,
            "session": res.session.model_dump() if res.session else None
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500    
    
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400
    
    try:
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        # Convert to dict for JSON serialization
        return jsonify({
            "user": res.user.model_dump() if res.user else None,
            "session": res.session.model_dump() if res.session else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        supabase.auth.sign_out()
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/user", methods=["GET"])
def get_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing Token"}), 401
    
    parts = auth_header.split()
    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({"error": "Invalid token format"}), 401
    token = parts[1]
    
    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            return jsonify({"error": "Invalid token"}), 401
        
        return jsonify({"user": user.user.model_dump()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500