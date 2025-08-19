

# /routes/deck_routes.py
from flask import Blueprint, request, jsonify
from utils.supabase_client import supabase, get_user_from_token

deck_bp = Blueprint("decks", __name__)

def extract_token(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None, "Missing Token"

    parts = auth_header.split()
    if len(parts) != 2 or parts[0] != "Bearer":
        return None, "Invalid token format"
    
    return parts[1], None

@deck_bp.route("/", methods=["GET"])
def get_decks():
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401
    
    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401
    
    try:
        supabase.postgrest.auth(token)
        decks = supabase.table("decks").select("*").execute()
        return jsonify(decks.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@deck_bp.route("/", methods=["POST"])
def create_deck():
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401
    
    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401
    
    data = request.json
    name = data.get("name")
    
    if not name:
        return jsonify({"error": "Deck name is required"}), 400
    
    try:
        supabase.postgrest.auth(token)
        res = supabase.table("decks").insert({
            "name": name,
            "user_id": user.id
        }).execute()
        return jsonify(res.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@deck_bp.route("/<deck_id>", methods=["DELETE"])
def delete_deck(deck_id):
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401
    
    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401

    try:
        supabase.postgrest.auth(token)
        supabase.table("decks").delete().eq("id", deck_id).execute()
        return jsonify({"message": "Deck deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@deck_bp.route("/<deck_id>", methods=["GET"])
def get_deck(deck_id):
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401
    
    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401

    # Fetch the deck from Supabase
    try:
        supabase.postgrest.auth(token)
        response = supabase.table("decks").select("*").eq("id", deck_id).single().execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

