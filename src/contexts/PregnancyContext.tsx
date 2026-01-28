import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  PregnancyProfile,
  calculateGestationalAge,
  calculateDueDateFromLMP,
  getDaysRemaining,
  GestationalAge,
} from "@/lib/pregnancy";
import { useAuth } from "@/contexts/AuthContext";
import { useCloudProfile, useSaveCloudProfile } from "@/hooks/useCloudStorage";
import { getProfile as getLocalProfile, saveProfile as saveLocalProfile, clearProfile as clearLocalProfile, generateId } from "@/lib/storage";

interface PregnancyContextType {
  profile: PregnancyProfile | null;
  gestationalAge: GestationalAge | null;
  daysRemaining: number;
  isSetupComplete: boolean;
  isLoading: boolean;
  setupProfile: (lmpDate: Date, name?: string) => void;
  setupProfileWithDueDate: (dueDate: Date, name?: string) => void;
  resetProfile: () => void;
}

const PregnancyContext = createContext<PregnancyContextType | undefined>(undefined);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data: cloudProfile, isLoading: cloudLoading } = useCloudProfile();
  const saveCloudProfile = useSaveCloudProfile();
  
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [gestationalAge, setGestationalAge] = useState<GestationalAge | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  // Load profile - prioritize cloud if authenticated
  useEffect(() => {
    if (user && cloudProfile) {
      // Convert cloud profile to local format
      const lmpDate = new Date(cloudProfile.due_date);
      lmpDate.setDate(lmpDate.getDate() - 280);
      
      const localProfile: PregnancyProfile = {
        id: cloudProfile.id,
        name: cloudProfile.name,
        lmpDate: lmpDate.toISOString(),
        dueDate: cloudProfile.due_date,
        createdAt: cloudProfile.created_at,
      };
      setProfile(localProfile);
    } else if (user && !cloudLoading && !cloudProfile) {
      // Check for local profile to migrate
      const localProfile = getLocalProfile();
      if (localProfile) {
        setProfile(localProfile);
        // Migrate to cloud
        saveCloudProfile.mutate({
          name: localProfile.name,
          due_date: localProfile.dueDate.split('T')[0],
        });
      }
    } else if (!user) {
      // Not authenticated, use local storage
      const savedProfile = getLocalProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      }
    }
  }, [user, cloudProfile, cloudLoading]);

  // Calculate gestational age when profile changes
  useEffect(() => {
    if (profile?.lmpDate) {
      const lmp = new Date(profile.lmpDate);
      const ga = calculateGestationalAge(lmp);
      setGestationalAge(ga);
      setDaysRemaining(getDaysRemaining(new Date(profile.dueDate)));
    }
  }, [profile]);

  const setupProfile = (lmpDate: Date, name: string = "HANAN") => {
    const dueDate = calculateDueDateFromLMP(lmpDate);
    const newProfile: PregnancyProfile = {
      id: generateId(),
      name,
      lmpDate: lmpDate.toISOString(),
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    if (user) {
      // Save to cloud
      saveCloudProfile.mutate({
        name,
        due_date: dueDate.toISOString().split('T')[0],
      });
    } else {
      // Save locally
      saveLocalProfile(newProfile);
    }
    setProfile(newProfile);
  };

  const setupProfileWithDueDate = (dueDate: Date, name: string = "HANAN") => {
    const lmpDate = new Date(dueDate);
    lmpDate.setDate(lmpDate.getDate() - 280);
    
    const newProfile: PregnancyProfile = {
      id: generateId(),
      name,
      lmpDate: lmpDate.toISOString(),
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    if (user) {
      // Save to cloud
      saveCloudProfile.mutate({
        name,
        due_date: dueDate.toISOString().split('T')[0],
      });
    } else {
      // Save locally
      saveLocalProfile(newProfile);
    }
    setProfile(newProfile);
  };

  const resetProfile = () => {
    clearLocalProfile();
    setProfile(null);
    setGestationalAge(null);
    setDaysRemaining(0);
  };

  return (
    <PregnancyContext.Provider
      value={{
        profile,
        gestationalAge,
        daysRemaining,
        isSetupComplete: !!profile,
        isLoading: cloudLoading,
        setupProfile,
        setupProfileWithDueDate,
        resetProfile,
      }}
    >
      {children}
    </PregnancyContext.Provider>
  );
}

export function usePregnancy() {
  const context = useContext(PregnancyContext);
  if (context === undefined) {
    throw new Error("usePregnancy must be used within a PregnancyProvider");
  }
  return context;
}
