export interface Business {
  _id: string;
  businessName: string;
  businessEmail: string;
  phoneNumber: string;
  address: string;
  businessCategory: string;
  totalStaff: number;
  status: string;
  country: string;
  city: string;
  postalCode?: number;
  sector: string;
  gallery: { url: string; publicId: string; uploadedAt: string }[];
  description: string;
  verification: string;
  openingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];
  ownerId: { _id: string; fullName: string; email: string; role: string };
  staffIds: string[];
  reviews: {
    _id: string;
    userId: { _id: string; fullName: string };
    rating: number;
    review: string;
    createdAt: string;
  }[];
  averageRating: number;
  totalReviews: number;
  totalServices: number;
  totalStaffMembers: number;
  staff: Staff[];
}

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  serviceDuration: string;
  price: number;
  description: string;
  serviceImages: { url: string; publicId: string; uploadedAt: string }[];
  businessId: string;
  businessOwnerId: string;
  isFeatured: boolean;
  averageRating: number;
  isActive: boolean;
}

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  businessId: string;
  serviceIds: { _id: string; serviceName: string; category?: string }[];
  description?: string;
  avatar: { url: string; publicId: string; uploadedAt: string };
  isActive: boolean;
}
