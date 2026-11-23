// Data models matching the required specification
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserRole = 'donor' | 'hospital' | 'blood_bank' | 'admin';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type EligibilityStatus = 'ELIGIBLE' | 'NOT ELIGIBLE';
export type RequestStatus = 'Pending' | 'Reserved' | 'Dispatched' | 'Fulfilled' | 'Cancelled';
export type RadiusTier = '5 KM' | '15 KM' | '30 KM' | '50 KM' | 'District Wide' | 'Neighbouring Districts';

export interface Donor {
  id: string;
  name: string;
  phone: string;
  email: string;
  blood_group: BloodGroup;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  last_donation_date: string; // ISO date string YYYY-MM-DD
  next_eligible_date: string; // ISO date string
  eligibility_status: EligibilityStatus;
  donations_count: number;
  available_for_emergency: boolean;
}

export interface BloodBank {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  phone: string;
  license_number: string;
  latitude: number;
  longitude: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  contact: string;
  latitude: number;
  longitude: number;
}

export interface InventoryItem {
  id: string;
  blood_bank_id: string;
  blood_group: BloodGroup;
  units_available: number;
  expiry_date: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  hospital_id: string;
  hospital_name: string;
  blood_group: BloodGroup;
  units_required: number;
  priority: PriorityLevel;
  patient_status: string;
  status: RequestStatus;
  created_at: string;
  assigned_to?: string; // Blood Bank or Donor name
  search_radius_used?: string;
  resolved_source?: 'Blood Bank' | 'Direct Donors';
}

export interface NotificationItem {
  id: string;
  user_id: string;
  user_role: UserRole;
  title: string;
  message: string;
  type: 'Emergency Blood Request' | 'Eligibility Available Again' | 'Blood Donation Camp' | 'Inventory Shortage Alert';
  sent_at: string;
  read: boolean;
  action_url?: string;
}

export interface DonorMatchResult {
  donor: Donor;
  matchScore: number;
  distanceKm: number;
  compatibilityFactor: number;
  rank: number;
  matchReasons: string[];
}

export interface AIShortagePrediction {
  blood_group: BloodGroup;
  current_units: number;
  predicted_demand: number;
  risk_level: 'Critical Shortage' | 'High Risk' | 'Moderate' | 'Safe / Adequate';
  status: 'Shortage Expected' | 'Depletion Imminent' | 'Stable' | 'Surplus';
  historical_7d_consumption: number;
  recommended_action: string;
  confidence: number;
}
