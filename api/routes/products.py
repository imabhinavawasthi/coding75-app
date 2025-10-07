import uuid
from flask import Blueprint, request, jsonify
from supabase_client import supabase
from models.products import Product, ProductResource, ProductMentor, ProductReview, SocialLink

products_bp = Blueprint("products", __name__)

@products_bp.route("/products/<uuid>", methods=["GET"])
def get_product(uuid):
    response = supabase.table("products").select("*").eq("id", uuid).execute()
    
    if not response.data:
        return jsonify({"error": "Product not found"}), 404

    row = response.data[0]

    # Build Product object
    product = Product(
        id=row.get("id"),
        product_title=row.get("product_title"),
        product_description=row.get("product_description"),
        product_discounted_price=row.get("product_discounted_price"),
        product_price=row.get("product_price"),
        status=row.get("status"),
        product_image_url=row.get("product_image_url", ""),
        product_resources=[ProductResource(**res) for res in row.get("product_resources", [])],
        product_mentors=[
            ProductMentor(
                mentor_name=m.get("mentor_name",""),
                mentor_image_url=m.get("mentor_image_url",""),
                mentor_designation=m.get("mentor_designation",""),
                mentor_social_links=SocialLink(**m.get("mentor_social_links", {})),
                mentor_username=m.get("mentor_username",""),
                mentor_email=m.get("mentor_email","")
            )
            for m in row.get("product_mentors", [])
        ],
        product_tags=row.get("product_tags", []),
        product_category=row.get("product_category"),
        product_reviews=[ProductReview(**rev) for rev in row.get("product_reviews", [])],
        created_at=row.get("created_at"),
        updated_at=row.get("updated_at")
    )

    return jsonify(product.__dict__), 200


@products_bp.route("/products", methods=["POST"])
def create_product():
    data = request.json
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    # Validate required fields
    required_fields = ["product_title", "product_price"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Convert to Product dataclass
    product = Product(
        id=str(uuid.uuid4()),
        product_title=data["product_title"],
        product_description=data.get("product_description"),
        product_discounted_price=data.get("product_discounted_price", 0.0),
        product_price=data["product_price"],
        status=data.get("status", "active"),
        product_image_url=data.get("product_image_url", ""),
        product_resources=[
            ProductResource(**res) for res in data.get("product_resources", [])
        ],
        product_mentors=[
            ProductMentor(
                mentor_name=m.get("mentor_name"),
                mentor_image_url=m.get("mentor_image_url"),
                mentor_designation=m.get("mentor_designation"),
                mentor_social_links=SocialLink(**m.get("mentor_social_links", {})),
                mentor_username=m.get("mentor_username",""),
                mentor_email=m.get("mentor_email","")
            )
            for m in data.get("product_mentors", [])
        ],
        product_tags=data.get("product_tags", []),
        product_category=data.get("product_category"),
        product_reviews=[
            ProductReview(**rev) for rev in data.get("product_reviews", [])
        ],
        created_at=data.get("created_at"),
        updated_at=data.get("updated_at")
    )

    # Prepare row for Supabase (convert nested dataclasses → dicts)
    row = {
        "product_title": product.product_title,
        "product_description": product.product_description,
        "product_discounted_price": product.product_discounted_price,
        "product_price": product.product_price,
        "status": product.status,
        "product_image_url": product.product_image_url,
        "product_resources": [res.__dict__ for res in product.product_resources],
        "product_mentors": [
            {
                **mentor.__dict__,
                "mentor_social_links": mentor.mentor_social_links.__dict__
            }
            for mentor in product.product_mentors
        ],
        "product_tags": product.product_tags,
        "product_category": product.product_category,
        "product_reviews": [rev.__dict__ for rev in product.product_reviews],
    }

    # Insert into Supabase
    response = supabase.table("products").insert(row).execute()

    if response.data:
        return jsonify({"message": "Product created", "product": response.data[0]}), 201
    return jsonify({"error": "Failed to create product"}), 400