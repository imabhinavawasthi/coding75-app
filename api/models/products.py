from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class SocialLink:
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    twitter: Optional[str] = ""
    facebook: Optional[str] = ""
    instagram: Optional[str] = ""
    youtube: Optional[str] = ""

@dataclass
class ProductResource:
    resource_link: str
    resource_title: str
    resource_description: str
    resource_image_url: Optional[str] = ""

@dataclass
class ProductMentor:
    mentor_name: str
    mentor_username: Optional[str] = ""
    mentor_email: Optional[str] = ""
    mentor_image_url: Optional[str] = ""
    mentor_designation: Optional[str] = ""
    mentor_social_links: Optional[SocialLink] = field(default_factory=list)

@dataclass
class ProductReview:
    reviewer_name: str
    rating: int  # out of 5
    review_text: Optional[str] = ""


@dataclass
class Product:
    id: str
    product_title: str
    product_description: Optional[str] = None
    product_discounted_price: float = 0.0
    product_price: float = 0.0
    status: str = "ACTIVE"
    product_image_url: str = ""
    product_resources: List[ProductResource] = field(default_factory=list)
    product_mentors: List[ProductMentor] = field(default_factory=list)
    product_tags: List[str] = field(default_factory=list)
    product_category: Optional[str] = None
    product_reviews: List[ProductReview] = field(default_factory=list)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
