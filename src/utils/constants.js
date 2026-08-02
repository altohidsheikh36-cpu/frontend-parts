// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';  // local host

export const API_URL = import.meta.env.VITE_API_URL;

export const API_BASE = API_URL.replace(/\/api\/?$/, '');

export function fullImageUrl(url) {
  if (!url) return '';
  // already absolute
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

export const VEHICLE_TYPES = ['car', 'bike'];

export const CAR_BRANDS = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Mahindra',
  'Toyota', 'Ford', 'Volkswagen', 'Renault', 'Nissan'
];

export const BIKE_BRANDS = [
  'Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield',
  'Yamaha', 'KTM', 'Suzuki', 'Kawasaki', 'Harley-Davidson'
];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
export const TRANSMISSION_TYPES = ['Manual', 'Automatic'];
export const OWNERSHIP_TYPES = ['1st Owner', '2nd Owner', '3rd Owner'];

export const PARTS_CATEGORIES = ['Engine & Drivetrain', 'Transmission & Gearbox', 'Brakes & Suspension', ' Electrical & Electronics',' Fuel & Exhaust System','Cooling & AC System','Body & Exterior' , 'Interior & Cabin', 'Wheels, Tyres & Steering',' Filters, Fluids & Service'];

// WhatsApp contact number for inquiries
export const WHATSAPP_NUMBER = '+918959203075'; // Replace with your actual WhatsApp number