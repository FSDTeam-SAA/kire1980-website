export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  serviceDuration: string;
  price: number;
  description: string;
  serviceImages: string[];
  businessId: string;
  businessOwnerId: string;
  isFeatured: boolean;
  averageRating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ServiceResponse {
  statusCode: number;
  message: string;
  data: Service[];
}
