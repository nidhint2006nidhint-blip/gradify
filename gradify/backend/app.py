import os
import io
import base64
import json
import datetime
from functools import wraps

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import razorpay

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from dotenv import load_dotenv
load_dotenv()

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me")
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")

FREE_LIMIT = int(os.environ.get("FREE_LIMIT", 15))          # free generations per account
PACK_PRICE_RUPEES = int(os.environ.get("PACK_PRICE_RUPEES", 20))
PACK_CREDITS = int(os.environ.get("PACK_CREDITS", 15))       # generations bought per ₹20

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=os.path.join(BASE_DIR, "..", "frontend"), static_url_path="")
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'gradify.db')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_sub = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255))
    picture = db.Column(db.String(512))
    free_used = db.Column(db.Integer, default=0)
    paid_credits = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "picture": self.picture,
            "free_used": self.free_used,
            "free_limit": FREE_LIMIT,
            "free_remaining": max(0, FREE_LIMIT - self.free_used),
            "paid_credits": self.paid_credits,
        }


class Generation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    chart_type = db.Column(db.String(32))
    title = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    razorpay_order_id = db.Column(db.String(64))
    razorpay_payment_id = db.Column(db.String(64))
    amount_rupees = db.Column(db.Integer)
    credits_added = db.Column(db.Integer)
    status = db.Column(db.String(32), default="created")
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)


with app.app_context():
    db.create_all()


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def issue_session_token(user):
    payload = {
        "uid": user.id,
        "email": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "missing_token"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "token_expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "invalid_token"}), 401
        user = User.query.get(payload["uid"])
        if not user:
            return jsonify({"error": "user_not_found"}), 401
        request.user = user
        return f(*args, **kwargs)

    return wrapper


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@app.route("/api/auth/google", methods=["POST"])
def auth_google():
    data = request.get_json(force=True)
    credential = data.get("credential")
    if not credential:
        return jsonify({"error": "missing_credential"}), 400
    if not GOOGLE_CLIENT_ID:
        return jsonify({"error": "server_not_configured",
                         "message": "GOOGLE_CLIENT_ID is not set on the server"}), 500
    try:
        info = id_token.verify_oauth2_token(
            credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        return jsonify({"error": "invalid_google_token"}), 401

    sub = info["sub"]
    email = info.get("email")
    name = info.get("name")
    picture = info.get("picture")

    user = User.query.filter_by(google_sub=sub).first()
    if not user:
        user = User(google_sub=sub, email=email, name=name, picture=picture)
        db.session.add(user)
        db.session.commit()

    token = issue_session_token(user)
    return jsonify({"token": token, "user": user.to_dict()})


@app.route("/api/me", methods=["GET"])
@auth_required
def me():
    return jsonify({"user": request.user.to_dict()})


# ---------------------------------------------------------------------------
# Chart generation
# ---------------------------------------------------------------------------
def render_chart(chart_type, title, labels, values, x_label, y_label, series2=None, series2_label=None):
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=150)

    if chart_type == "bar":
        x = np.arange(len(labels))
        if series2:
            width = 0.35
            ax.bar(x - width / 2, values, width, label=y_label or "Series 1")
            ax.bar(x + width / 2, series2, width, label=series2_label or "Series 2")
            ax.legend()
        else:
            ax.bar(labels, values, color="#4f46e5")
        ax.set_xticks(x)
        ax.set_xticklabels(labels, rotation=30, ha="right")

    elif chart_type == "line":
        ax.plot(labels, values, marker="o", color="#4f46e5", label=y_label or "Series 1")
        if series2:
            ax.plot(labels, series2, marker="o", color="#f97316", label=series2_label or "Series 2")
            ax.legend()
        plt.setp(ax.get_xticklabels(), rotation=30, ha="right")

    elif chart_type == "pie":
        ax.pie(values, labels=labels, autopct="%1.1f%%", startangle=90)
        ax.axis("equal")

    elif chart_type == "scatter":
        ax.scatter(labels, values, color="#4f46e5")
        plt.setp(ax.get_xticklabels(), rotation=30, ha="right")

    elif chart_type == "histogram":
        ax.hist(values, bins=min(10, max(3, len(values) // 2)), color="#4f46e5", edgecolor="white")

    elif chart_type == "boxplot":
        ax.boxplot(values, labels=labels if len(labels) == 1 else None, vert=True)

    else:
        raise ValueError("unsupported_chart_type")

    if title:
        ax.set_title(title, fontsize=13, fontweight="bold")
    if x_label and chart_type not in ("pie",):
        ax.set_xlabel(x_label)
    if y_label and chart_type not in ("pie",):
        ax.set_ylabel(y_label)

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png", transparent=False, facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


@app.route("/api/generate", methods=["POST"])
@auth_required
def generate():
    user = request.user
    if user.free_used >= FREE_LIMIT and user.paid_credits <= 0:
        return jsonify({
            "error": "limit_reached",
            "message": f"You've used all {FREE_LIMIT} free generations. Buy a pack of {PACK_CREDITS} for ₹{PACK_PRICE_RUPEES}.",
        }), 402

    data = request.get_json(force=True)
    chart_type = data.get("type", "bar")
    title = data.get("title", "")
    labels = data.get("labels", [])
    values = data.get("values", [])
    x_label = data.get("x_label", "")
    y_label = data.get("y_label", "")
    series2 = data.get("series2")
    series2_label = data.get("series2_label")

    if not values:
        return jsonify({"error": "missing_values"}), 400

    try:
        values = [float(v) for v in values]
        if series2:
            series2 = [float(v) for v in series2]
    except (TypeError, ValueError):
        return jsonify({"error": "values_must_be_numeric"}), 400

    try:
        image_b64 = render_chart(chart_type, title, labels, values, x_label, y_label, series2, series2_label)
    except ValueError:
        return jsonify({"error": "unsupported_chart_type"}), 400

    # Deduct usage: free first, then paid credits
    if user.free_used < FREE_LIMIT:
        user.free_used += 1
    else:
        user.paid_credits -= 1

    db.session.add(Generation(user_id=user.id, chart_type=chart_type, title=title))
    db.session.commit()

    return jsonify({
        "image": f"data:image/png;base64,{image_b64}",
        "user": user.to_dict(),
    })


# ---------------------------------------------------------------------------
# Payments (Razorpay)
# ---------------------------------------------------------------------------
@app.route("/api/payment/create-order", methods=["POST"])
@auth_required
def create_order():
    if not razorpay_client:
        return jsonify({"error": "payments_not_configured",
                         "message": "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set on server"}), 500

    amount_paise = PACK_PRICE_RUPEES * 100
    order = razorpay_client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "payment_capture": 1,
    })

    payment = Payment(
        user_id=request.user.id,
        razorpay_order_id=order["id"],
        amount_rupees=PACK_PRICE_RUPEES,
        credits_added=PACK_CREDITS,
        status="created",
    )
    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "order_id": order["id"],
        "amount": amount_paise,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
        "credits": PACK_CREDITS,
    })


@app.route("/api/payment/verify", methods=["POST"])
@auth_required
def verify_payment():
    if not razorpay_client:
        return jsonify({"error": "payments_not_configured"}), 500

    data = request.get_json(force=True)
    order_id = data.get("razorpay_order_id")
    payment_id = data.get("razorpay_payment_id")
    signature = data.get("razorpay_signature")

    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
    except razorpay.errors.SignatureVerificationError:
        return jsonify({"error": "signature_verification_failed"}), 400

    payment = Payment.query.filter_by(razorpay_order_id=order_id, user_id=request.user.id).first()
    if not payment:
        return jsonify({"error": "order_not_found"}), 404
    if payment.status == "paid":
        return jsonify({"user": request.user.to_dict()})  # already processed

    payment.status = "paid"
    payment.razorpay_payment_id = payment_id
    request.user.paid_credits += payment.credits_added
    db.session.commit()

    return jsonify({"user": request.user.to_dict()})


# ---------------------------------------------------------------------------
# Serve frontend
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
