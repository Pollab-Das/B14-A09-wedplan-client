import { getPublicServices } from "@/lib/api";
import { notFound } from "next/navigation";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { MapPin, Tag, CheckCircle, Mail, Phone } from "lucide-react";
import { BookingForm } from "@/components/services/BookingForm";

type VendorInfo = {
  name?: unknown;
  businessName?: unknown;
  image?: unknown;
  email?: unknown;
  phone?: unknown;
};

type ServiceRecord = {
  _id?: string;
  serviceName?: string;
  category?: string;
  description?: string;
  location?: string;
  images?: unknown;
  vendor?: unknown;
  vendorId?: unknown;
  vendorInfo?: unknown;
  vendorName?: string;
  businessName?: string;
  vendorImage?: string;
  vendorEmail?: string;
  vendorPhone?: string;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getVendorInfo(service: ServiceRecord): VendorInfo {
  const nested = service?.vendor ?? service?.vendorId ?? service?.vendorInfo;
  if (nested && typeof nested === "object") return nested as VendorInfo;

  return {
    name: service?.vendorName,
    businessName: service?.businessName,
    image: service?.vendorImage,
    email: service?.vendorEmail,
    phone: service?.vendorPhone,
  };
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const services = await getPublicServices();
  const service = Array.isArray(services)
    ? (services.find((item: ServiceRecord) => item?._id === id) as ServiceRecord | undefined)
    : undefined;

  if (!service) {
    notFound();
  }

  const serviceName = asText(service.serviceName) || "Wedding Service";
  const description =
    asText(service.description) ||
    "This vendor has not added a description yet. Reach out to learn more about the service.";
  const location = asText(service.location) || "Location available on request";
  const rawImages: unknown = service.images;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages.filter(
        (image): image is string => typeof image === "string" && image.trim().length > 0,
      )
    : [];
  const gallery: string[] = images.length > 0 ? images : ["/wedding-hero.svg"];

  const vendor = getVendorInfo(service);
  const vendorName =
    asText(vendor.businessName) || asText(vendor.name) || "Verified WedPlan Vendor";
  const vendorImage = asText(vendor.image);
  const vendorEmail = asText(vendor.email);
  const vendorPhone = asText(vendor.phone);
  const validEmail = vendorEmail.includes("@") ? vendorEmail : "";
  const validPhone = vendorPhone.replace(/\D/g, "").length >= 7 ? vendorPhone : "";
  const initials =
    vendorName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "WV";

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <SiteNavbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/20 bg-[#1e293b]">
                <img
                  src={gallery[0]}
                  alt={serviceName}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="rounded-xl overflow-hidden border border-[#d4af37]/10 bg-[#1e293b]"
                    >
                      <img
                        src={image}
                        alt={`${serviceName} photo ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1e293b] p-8 rounded-2xl border border-[#d4af37]/10">
              <div className="flex items-center gap-2 text-sm text-[#d4af37] uppercase font-bold tracking-wider mb-2">
                <Tag className="w-4 h-4" /> {asText(service.category) || "Wedding Service"}
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#FDFBF7] mb-4">
                {serviceName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-slate-700/50">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {location}
                </span>
                <span className="flex items-center gap-1 text-[#d4af37]">
                  <CheckCircle className="w-4 h-4" /> Verified Vendor
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#FDFBF7] mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            <div className="bg-[#1e293b] p-8 rounded-2xl border border-[#d4af37]/10">
              <h2 className="text-xl font-bold text-[#FDFBF7] mb-6">Meet the Vendor</h2>
              <div className="flex items-center gap-4">
                {vendorImage ? (
                  <img
                    src={vendorImage}
                    alt={vendorName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]/40 bg-[#0f172a]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/40 bg-[#0f172a] text-[#d4af37] flex items-center justify-center font-bold text-lg">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-[#FDFBF7]">{vendorName}</p>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[#d4af37]" /> Verified WedPlan vendor
                  </p>
                </div>
              </div>

              {(validEmail || validPhone) && (
                <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-slate-700/50 text-sm">
                  {validEmail && (
                    <a
                      href={`mailto:${validEmail}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-[#d4af37] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#d4af37]" /> {validEmail}
                    </a>
                  )}
                  {validPhone && (
                    <a
                      href={`tel:${validPhone.replace(/\D/g, "")}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-[#d4af37] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#d4af37]" /> {validPhone}
                    </a>
                  )}
                </div>
              )}

              {!validEmail && !validPhone && (
                <p className="text-sm text-slate-400 mt-5">
                  Contact details are shared once your booking request is accepted.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm service={service} />
          </div>
        </div>
      </main>
    </div>
  );
}
