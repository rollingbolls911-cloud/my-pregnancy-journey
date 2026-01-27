import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  PregnancyProfile,
  calculateGestationalAge,
  calculateDueDateFromLMP,
  getDaysRemaining,
  GestationalAge,
} from "@/lib/pregnancy";
import { getProfile, saveProfile, clearProfile, generateId } from "@/lib/storage";

interface PregnancyContextType {
  profile: PregnancyProfile | null;
  gestationalAge: GestationalAge | null;
  daysRemaining: number;
  isSetupComplete: boolean;
  setupProfile: (lmpDate: Date, name?: string) => void;
  setupProfileWithDueDate: (dueDate: Date, name?: string) => void;
  resetProfile: () => void;
}

const PregnancyContext = createContext<PregnancyContextType | undefined>(undefined);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [gestationalAge, setGestationalAge] = useState<GestationalAge | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  // Load profile on mount
  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

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
    saveProfile(newProfile);
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
    saveProfile(newProfile);
    setProfile(newProfile);
  };

  const resetProfile = () => {
    clearProfile();
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
