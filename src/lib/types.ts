export type ServiceStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface VendorSummary {
  _id?: string;
  name?: string;
  email?: string;
  businessName?: string;
  image?: string;
}

export interface Service {
  _id: string;
  vendorId: string;
  vendor?: VendorSummary;
  vendorName?: string;
  vendorEmail?: string;
  vendorBusinessName?: string;
  vendorImage?: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}