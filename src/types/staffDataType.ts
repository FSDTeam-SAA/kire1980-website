export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  businessId: Business;
  serviceIds: Service[];
  description: string;
  avatar: Avatar;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Business {
  _id: string;
  businessName: string;
}

export interface Service {
  _id: string;
  serviceName: string;
}

export interface Avatar {
  url: string;
  publicId: string;
  uploadedAt: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StaffResponse {
  statusCode: number;
  message: string;
  data: {
    data: Staff[];
    meta: Meta;
  };
}
