from flask import Flask
from routes.products import products_bp
from routes.health import health_bp

app = Flask(__name__)

# Register blueprint
app.register_blueprint(products_bp, url_prefix="/api/")
app.register_blueprint(health_bp, url_prefix="/api/")

if __name__ == "__main__":
    app.run(debug=True)

# export FLASK_APP=app.py
# flask run -p 5328