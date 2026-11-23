import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Donor,
  BloodBank,
  Hospital,
  InventoryItem,
  BloodRequest,
  NotificationItem,
  UserRole,
  BloodGroup,
  PriorityLevel,
  AIShortagePrediction,
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_BLOOD_BANKS,
  INITIAL_HOSPITALS,
  INITIAL_INVENTORY,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { calculateEligibility, calculateShortagePredictions } from '../utils/aiPrediction';

interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  blood_group?: BloodGroup;
}

interface AppContextType {
  // Current session & auth
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: AppUser;
  loginAs: (role: UserRole, id?: string) => void;
  logout: () => void;
  isLoggedIn: boolean;

  // Global State Entities
  donors: Donor[];
  bloodBanks: BloodBank[];
  hospitals: Hospital[];
  inventory: InventoryItem[];
  requests: BloodRequest[];
  notifications: NotificationItem[];
  shortagePredictions: AIShortagePrediction[];

  // Donor operations
  updateDonorProfile: (id: string, updates: Partial<Donor>) => void;
  recordDonation: (donorId: string) => void;

  // Inventory operations
  addInventoryStock: (bloodBankId: string, bloodGroup: BloodGroup, units: number, expiryDate: string) => void;
  updateInventoryStock: (invId: string, units: number) => void;
  removeInventoryStock: (invId: string) => void;

  // Request & Emergency operations
  createEmergencyRequest: (req: {
    hospitalId: string;
    bloodGroup: BloodGroup;
    unitsRequired: number;
    priority: PriorityLevel;
    patientStatus: string;
    selectedRadius?: string;
  }) => { success: boolean; message: string; requestId: string; resolvedVia: 'Blood Bank' | 'Donors' | 'Pending' };

  updateRequestStatus: (requestId: string, status: BloodRequest['status']) => void;
  acceptEmergencyRequestByDonor: (requestId: string, donorId: string) => void;
  rejectEmergencyRequestByDonor: (requestId: string, donorId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('donor');

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem('bc_donors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_DONORS.map(d => {
      const el = calculateEligibility(d.last_donation_date);
      return {
        ...d,
        next_eligible_date: el.next_eligible_date,
        eligibility_status: el.eligibility_status,
      };
    });
  });

  const [bloodBanks] = useState<BloodBank[]>(() => {
    const saved = localStorage.getItem('bc_blood_banks');
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_BANKS;
  });

  const [hospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('bc_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('bc_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem('bc_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser>(() => ({
    id: 'donor-1',
    name: 'Rahul Sharma',
    role: 'donor',
    email: 'rahul.sharma@example.com',
    blood_group: 'O-',
  }));

  useEffect(() => {
    localStorage.setItem('bc_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('bc_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('bc_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('bc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const loginAs = (role: UserRole, id?: string) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    if (role === 'donor') {
      const d = id ? donors.find(x => x.id === id) : donors[0];
      if (d) {
        setCurrentUser({ id: d.id, name: d.name, role: 'donor', email: d.email, blood_group: d.blood_group });
      }
    } else if (role === 'hospital') {
      const h = id ? hospitals.find(x => x.id === id) : hospitals[0];
      if (h) {
        setCurrentUser({ id: h.id, name: h.name, role: 'hospital', email: 'trauma.desk@aiims.edu' });
      }
    } else if (role === 'blood_bank') {
      const b = id ? bloodBanks.find(x => x.id === id) : bloodBanks[0];
      if (b) {
        setCurrentUser({ id: b.id, name: b.name, role: 'blood_bank', email: 'lab@apolloblood.org' });
      }
    } else if (role === 'admin') {
      setCurrentUser({ id: 'admin-1', name: 'Dr. Vikramaditya (Director of Health)', role: 'admin', email: 'director.bloodconnect@health.gov.in' });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateDonorProfile = (id: string, updates: Partial<Donor>) => {
    setDonors(prev =>
      prev.map(d => {
        if (d.id === id) {
          const updated = { ...d, ...updates };
          if (updates.last_donation_date) {
            const el = calculateEligibility(updates.last_donation_date);
            updated.next_eligible_date = el.next_eligible_date;
            updated.eligibility_status = el.eligibility_status;
          }
          return updated;
        }
        return d;
      })
    );
  };

  const recordDonation = (donorId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const el = calculateEligibility(today);

    setDonors(prev =>
      prev.map(d => {
        if (d.id === donorId) {
          return {
            ...d,
            last_donation_date: today,
            next_eligible_date: el.next_eligible_date,
            eligibility_status: 'NOT ELIGIBLE',
            donations_count: d.donations_count + 1,
          };
        }
        return d;
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: donorId,
      user_role: 'donor',
      title: 'Heroic Donation Logged! Cooldown Activated',
      message: `Thank you for your life-saving blood donation on ${today}. Your 90-day biological replenishment rest period ends on ${el.next_eligible_date}. Notifications will pause until then.`,
      type: 'Eligibility Available Again',
      sent_at: new Date().toLocaleString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addInventoryStock = (bloodBankId: string, bloodGroup: BloodGroup, units: number, expiryDate: string) => {
    const existing = inventory.find(i => i.blood_bank_id === bloodBankId && i.blood_group === bloodGroup);
    if (existing) {
      setInventory(prev =>
        prev.map(i =>
          i.id === existing.id
            ? { ...i, units_available: i.units_available + units, expiry_date: expiryDate, updated_at: new Date().toISOString().split('T')[0] }
            : i
        )
      );
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        blood_bank_id: bloodBankId,
        blood_group: bloodGroup,
        units_available: units,
        expiry_date: expiryDate,
        updated_at: new Date().toISOString().split('T')[0],
      };
      setInventory(prev => [newItem, ...prev]);
    }
  };

  const updateInventoryStock = (invId: string, units: number) => {
    setInventory(prev =>
      prev.map(i =>
        i.id === invId
          ? { ...i, units_available: units, updated_at: new Date().toISOString().split('T')[0] }
          : i
      )
    );
  };

  const removeInventoryStock = (invId: string) => {
    setInventory(prev => prev.filter(i => i.id !== invId));
  };

  const createEmergencyRequest = ({
    hospitalId,
    bloodGroup,
    unitsRequired,
    priority,
    patientStatus,
    selectedRadius = '15 KM',
  }: {
    hospitalId: string;
    bloodGroup: BloodGroup;
    unitsRequired: number;
    priority: PriorityLevel;
    patientStatus: string;
    selectedRadius?: string;
  }): { success: boolean; message: string; requestId: string; resolvedVia: 'Blood Bank' | 'Donors' | 'Pending' } => {
    const hosp = hospitals.find(h => h.id === hospitalId) || hospitals[0];
    const newReqId = `req-${Date.now().toString().slice(-4)}`;

    const availableBanksWithStock = inventory.filter(
      item => item.blood_group === bloodGroup && item.units_available >= unitsRequired
    );

    if (availableBanksWithStock.length > 0) {
      const targetStock = availableBanksWithStock[0];
      const bank = bloodBanks.find(b => b.id === targetStock.blood_bank_id);

      updateInventoryStock(targetStock.id, targetStock.units_available - unitsRequired);

      const newRequest: BloodRequest = {
        id: newReqId,
        hospital_id: hospitalId,
        hospital_name: hosp.name,
        blood_group: bloodGroup,
        units_required: unitsRequired,
        priority,
        patient_status: patientStatus,
        status: 'Reserved',
        created_at: new Date().toLocaleString(),
        assigned_to: bank?.name || 'Central Blood Bank',
        resolved_source: 'Blood Bank',
      };

      setRequests(prev => [newRequest, ...prev]);

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          user_id: hospitalId,
          user_role: 'hospital',
          title: `Blood Units Reserved at ${bank?.name}`,
          message: `${unitsRequired} units of ${bloodGroup} have been reserved at ${bank?.name}. Dispatch protocol initiated.`,
          type: 'Emergency Blood Request',
          sent_at: new Date().toLocaleString(),
          read: false,
        },
        ...prev,
      ]);

      return {
        success: true,
        message: `Step 1 Match: ${unitsRequired} units of ${bloodGroup} successfully reserved at ${bank?.name}.`,
        requestId: newReqId,
        resolvedVia: 'Blood Bank',
      };
    }

    const eligibleDonors = donors.filter(
      d => d.eligibility_status === 'ELIGIBLE' && (d.blood_group === bloodGroup || d.blood_group === 'O-')
    );

    const newRequest: BloodRequest = {
      id: newReqId,
      hospital_id: hospitalId,
      hospital_name: hosp.name,
      blood_group: bloodGroup,
      units_required: unitsRequired,
      priority,
      patient_status: patientStatus,
      status: 'Pending',
      created_at: new Date().toLocaleString(),
      search_radius_used: selectedRadius,
      resolved_source: 'Direct Donors',
    };

    setRequests(prev => [newRequest, ...prev]);

    const newNotifs: NotificationItem[] = eligibleDonors.map(donor => ({
      id: `notif-${Date.now()}-${donor.id}`,
      user_id: donor.id,
      user_role: 'donor',
      title: `EMERGENCY [${priority}]: ${bloodGroup} Needed at ${hosp.name}`,
      message: `${hosp.name} urgently requires ${unitsRequired} units of ${bloodGroup} for "${patientStatus}". You are medically eligible. Can you donate?`,
      type: 'Emergency Blood Request',
      sent_at: new Date().toLocaleString(),
      read: false,
      action_url: `/donor?req=${newReqId}`,
    }));

    setNotifications(prev => [...newNotifs, ...prev]);

    return {
      success: true,
      message: `Step 1 Blood Bank stock exhausted. Step 2 Executed: Broadcasted emergency alerts to ${eligibleDonors.length} medically ELIGIBLE donors within ${selectedRadius}. (Ineligible donors safely shielded).`,
      requestId: newReqId,
      resolvedVia: 'Donors',
    };
  };

  const updateRequestStatus = (requestId: string, status: BloodRequest['status']) => {
    setRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status } : r)));
  };

  const acceptEmergencyRequestByDonor = (requestId: string, donorId: string) => {
    const donor = donors.find(d => d.id === donorId);
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'Reserved',
            assigned_to: `Donor: ${donor?.name || 'Verified Donor'} (${donor?.phone || ''})`,
          };
        }
        return r;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: donorId,
        user_role: 'donor',
        title: 'Thank You for Accepting!',
        message: `You accepted emergency request ${requestId}. The hospital coordinator has been notified and will coordinate reception.`,
        type: 'Emergency Blood Request',
        sent_at: new Date().toLocaleString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const rejectEmergencyRequestByDonor = (requestId: string, donorId: string) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user_id: donorId,
        user_role: 'donor',
        title: 'Request Declined',
        message: `You declined emergency request ${requestId}. Our AI system has routed the request to the next highest-ranked eligible donor.`,
        type: 'Emergency Blood Request',
        sent_at: new Date().toLocaleString(),
        read: true,
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const shortagePredictions = calculateShortagePredictions(inventory);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        loginAs,
        logout,
        isLoggedIn,
        donors,
        bloodBanks,
        hospitals,
        inventory,
        requests,
        notifications,
        shortagePredictions,
        updateDonorProfile,
        recordDonation,
        addInventoryStock,
        updateInventoryStock,
        removeInventoryStock,
        createEmergencyRequest,
        updateRequestStatus,
        acceptEmergencyRequestByDonor,
        rejectEmergencyRequestByDonor,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
