export const PLAN_LIMITS = {
  free: {
    maxServices: 4,
    maxGalleryImages: 4,
    maxEnquiriesPerMonth: 25,
    maxUploadSizeMB: 2,
    price: 0,
    name: 'Basic Plan'
  },
  premium: {
    maxServices: Infinity,
    maxGalleryImages: Infinity,
    maxEnquiriesPerMonth: Infinity,
    maxUploadSizeMB: 10,
    price: 799,
    name: 'Unlimited Premium Plan'
  }
};
