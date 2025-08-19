# app.py

from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.deck_routes import deck_bp
from routes.card_routes import card_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(deck_bp, url_prefix="/decks")
app.register_blueprint(card_bp, url_prefix="/cards")

@app.route("/", methods=["GET"])
def health_check():
    return {"status": "OK", "message": "Flashcard API is running"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)