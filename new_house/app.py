from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)

# ======================
# Load trained models
# ======================
linear_model = joblib.load("linear_model.pkl")

logistic_model = joblib.load("logistic_model.pkl")
logistic_scaler = joblib.load("logistic_scaler.pkl")

svr_model = joblib.load("svr_model.pkl")
svr_scaler = joblib.load("svr_scaler.pkl")

# Model performance values (from training)
MODEL_ACCURACY = {
    "Linear Regression": "R² = 0.99",
    "SVR": "R² = 0.92",
    "Logistic Regression": "Accuracy = 100%"
}

BEST_MODEL_REASON = {
    "Linear Regression": "Simple and interpretable numeric prediction",
    "SVR": "Captures non-linear patterns",
    "Logistic Regression": "Highest decision accuracy and reliability"
}

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # User input
        size = float(request.form["size"])
        bedrooms = int(request.form["bedrooms"])
        age = int(request.form["age"])
        location = int(request.form["location"])

        user_input = np.array([[size, bedrooms, age, location]])

        # -------- Linear Regression --------
        lr_price = linear_model.predict(user_input)[0]

        # -------- SVR --------
        svr_scaled = svr_scaler.transform(user_input)
        svr_price = svr_model.predict(svr_scaled)[0]

        # -------- Logistic Regression --------
        log_scaled = logistic_scaler.transform(user_input)
        log_pred = logistic_model.predict(log_scaled)[0]
        category = "High Price House" if log_pred == 1 else "Low Price House"

        # Decide best model (decision-based priority)
        best_model = "Logistic Regression"

        # Comparison table data
        comparison = [
            {
                "model": "Linear Regression",
                "prediction": f"₹ {round(lr_price,2)} Lakhs",
                "performance": MODEL_ACCURACY["Linear Regression"],
                "reason": BEST_MODEL_REASON["Linear Regression"]
            },
            {
                "model": "SVR",
                "prediction": f"₹ {round(svr_price,2)} Lakhs",
                "performance": MODEL_ACCURACY["SVR"],
                "reason": BEST_MODEL_REASON["SVR"]
            },
            {
                "model": "Logistic Regression",
                "prediction": category,
                "performance": MODEL_ACCURACY["Logistic Regression"],
                "reason": BEST_MODEL_REASON["Logistic Regression"]
            }
        ]

        return render_template(
            "index.html",
            comparison=comparison,
            best_model=best_model
        )

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
