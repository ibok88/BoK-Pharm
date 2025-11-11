from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid
import enum

def gen_uuid():
    return str(uuid.uuid4())

class OrderStatus(str, enum.Enum):
    created = "created"
    pending = "pending"
    confirmed = "confirmed"
    dispatched = "dispatched"
    delivered = "delivered"
    cancelled = "cancelled"
    completed = "completed"

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    firebase_uid: str
    name: str
    surname: str
    email: str
    mobile_number: str
    date_of_birth: datetime
    role: str = Field(default="customer")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Pharmacy(SQLModel, table=True):
    __tablename__ = "pharmacies"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    name: str
    address: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    email: str
    phone: str
    is_active: bool = True
    opening_hours: Optional[str] = None
    logo_url: Optional[str] = None
    license_number: str
    is_verified: bool = False
    created_at: datetime = Field(default=datetime.utcnow)

class Medication(SQLModel, table=True):
    __tablename__ = "medications"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    name: str
    description: Optional[str] = None
    dosage: Optional[str] = None
    manufacturer: Optional[str] = None
    category: Optional[str] = None
    is_otc: bool = True
    price: float = 0.0
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Order(SQLModel, table=True):
    __tablename__ = "orders"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    user_id: str = Field(index=True)
    pharmacy_id: str = Field(index=True)
    status: OrderStatus = Field(default=OrderStatus.created)
    total_amount: float = 0.0
    delivery_address: str
    delivery_city: Optional[str] = None
    delivery_state: Optional[str] = None
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    order_id: str = Field(index=True)
    medication_id: str = Field(index=True)
    medication_name: str
    dosage: Optional[str] = None
    quantity: int = 1
    unit_price: float = 0.0
    total_price: float = 0.0

class Cart(SQLModel, table=True):
    __tablename__ = "carts"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"
    
    id: str = Field(default_factory=gen_uuid, primary_key=True)
    cart_id: str = Field(index=True)
    medication_id: str = Field(index=True)
    medication_name: str
    dosage: Optional[str] = None
    quantity: int = 1
    unit_price: float = 0.0
    total_price: float = 0.0
