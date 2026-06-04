export const PLAN_LIMITS = {
  free: {
    maxVCards: 4,
    maxServices: 4,
    maxGalleryImages: 4,
    maxEnquiriesPerMonth: 25,
    maxUploadSizeMB: 5,
    price: 0,
    name: 'Basic Plan'
  },
  premium: {
    maxVCards: Infinity,
    maxServices: Infinity,
    maxGalleryImages: Infinity,
    maxEnquiriesPerMonth: Infinity,
    maxUploadSizeMB: 10,
    price: 799,
    name: 'Unlimited Premium Plan'
  }
};
