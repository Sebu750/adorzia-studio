import { createContext, useContext, useState, ReactNode } from "react";
import type { 
  StyleBoxTemplate, 
  ColorEntry, 
  MoodboardImage, 
  MaterialDirection, 
  TechnicalRequirements, 
  DesignGuidelines, 
  EvaluationCriterion, 
  DeliverableItem,
  StyleBoxCategory,
  DifficultyLevel,
} from "@/lib/stylebox-template";
import { 
  createEmptyStyleBoxTemplate, 
  DIFFICULTY_PRESETS,
  DEFAULT_EVALUATION_CRITERIA,
  getCategoryDeliverables,
} from "@/lib/stylebox-template";

interface WizardContextType {
  formData: StyleBoxTemplate;
  updateFormData: <K extends keyof StyleBoxTemplate>(key: K, value: StyleBoxTemplate[K]) => void;
  updateNestedData: <K extends keyof StyleBoxTemplate>(
    key: K, 
    nestedKey: string, 
    value: unknown
  ) => void;
  setFormData: (data: StyleBoxTemplate) => void;
  resetForm: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isEditing: boolean;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function useWizardContext() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizardContext must be used within WizardProvider");
  }
  return context;
}

interface WizardProviderProps {
  children: ReactNode;
  initialData?: StyleBoxTemplate | null;
}

export function WizardProvider({ children, initialData }: WizardProviderProps) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [formData, setFormDataState] = useState<StyleBoxTemplate>(() => 
    initialData || createEmptyStyleBoxTemplate()
  );
  
  const isEditing = !!initialData?.id;

  const updateFormData = <K extends keyof StyleBoxTemplate>(
    key: K, 
    value: StyleBoxTemplate[K]
  ) => {
    setFormDataState(prev => {
      const updated = { ...prev, [key]: value };
      
      // Auto-update design guidelines when difficulty changes
      if (key === 'difficulty') {
        const difficulty = value as DifficultyLevel;
        updated.design_guidelines = {
          ...prev.design_guidelines,
          ...DIFFICULTY_PRESETS[difficulty],
          difficulty_level: difficulty,
        };
      }
      
      // Auto-update deliverables when category changes
      if (key === 'category') {
        const category = value as StyleBoxCategory;
        updated.deliverables = getCategoryDeliverables(category);
      }
      
      return updated;
    });
  };

  const updateNestedData = <K extends keyof StyleBoxTemplate>(
    key: K,
    nestedKey: string,
    value: unknown
  ) => {
    setFormDataState(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] as Record<string, unknown>),
        [nestedKey]: value,
      },
    }));
  };

  const setFormData = (data: StyleBoxTemplate) => {
    setFormDataState(data);
  };

  const resetForm = () => {
    setFormDataState(createEmptyStyleBoxTemplate());
    setCurrentTab("basic");
  };

  return (
    <WizardContext.Provider
      value={{
        formData,
        updateFormData,
        updateNestedData,
        setFormData,
        resetForm,
        currentTab,
        setCurrentTab,
        isEditing,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}
