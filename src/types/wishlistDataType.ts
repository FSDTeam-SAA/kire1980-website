interface GalleryItem {
  url: string;
  publicId: string;
  uploadedAt: string;
}

interface Business {
  _id: string;
  businessName: string;
  businessEmail: string;
  phoneNumber: string;
  businessCategory: string;
  totalStaff: number;
  status: string;
  country: string;
  city: string;
  postalCode: number;
  sector: string;
  gallery: GalleryItem[];
  description: string;
  verification: string;
  openingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];
  ownerId: string;
  staffIds: string[];
  jobs: [];
  reviews: [];
  socialMediaLinks: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WishlistItem {
  _id: string;
  userId: string;
  businessId: Business;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WishlistResponse {
  statusCode: number;
  message: string;
  data: WishlistItem[];
}
