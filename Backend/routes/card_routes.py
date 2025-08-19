# /routes/card_routes.py
from flask import Blueprint, request, jsonify
from utils.supabase_client import supabase, get_user_from_token

card_bp = Blueprint("cards", __name__)

def extract_token(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None, "Missing Token"

    parts = auth_header.split()
    if len(parts) != 2 or parts[0] != "Bearer":
        return None, "Invalid token format"
    
    return parts[1], None

@card_bp.route("/<deck_id>", methods=["GET"])
def get_cards(deck_id):
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401

    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401

    try:
        supabase.postgrest.auth(token)
        cards = supabase.table("flashcards").select("*").eq("deck_id", deck_id).execute()
        return jsonify(cards.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@card_bp.route("/", methods=["POST"])
def create_card():
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401

    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401

    data = request.json
    deck_id = data.get("deck_id")
    question = data.get("question")
    answer = data.get("answer")

    if not deck_id or not question or not answer:
        return jsonify({"error": "Deck ID, question, and answer are required"}), 400

    try:
        supabase.postgrest.auth(token)
        res = supabase.table("flashcards").insert({
            "deck_id": deck_id,
            "question": question,
            "answer": answer,
            "user_id": user.id
        }).execute()
        return jsonify(res.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@card_bp.route("/<card_id>", methods=["PUT"])
def update_card(card_id):
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401

    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401

    data = request.json

    try:
        supabase.postgrest.auth(token)
        res = supabase.table("flashcards").update(data).eq("id", card_id).execute()
        return jsonify(res.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@card_bp.route("/<card_id>", methods=["DELETE"])
def delete_card(card_id):
    token, error = extract_token(request)
    if error:
        return jsonify({"error": error}), 401

    user, auth_error = get_user_from_token(token)
    if auth_error:
        return jsonify({"error": auth_error}), 401

    try:
        supabase.postgrest.auth(token)
        supabase.table("flashcards").delete().eq("id", card_id).execute()
        return jsonify({"message": "Card deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500