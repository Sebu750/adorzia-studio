import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, ProjectAsset, PublicationRequest } from '../lib/dual-layer-types';
import { DualLayerService } from '../lib/dual-layer-service';

interface DualLayerState {
  projects: Project[];
  projectAssets: Record<string, ProjectAsset[]>; // project_id -> assets
  publicationRequests: PublicationRequest[];
  loading: {
    projects: boolean;
    assets: Record<string, boolean>; // project_id -> loading status
    requests: boolean;
  };
  error: string | null;
}

type DualLayerAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_PROJECT_ASSETS'; payload: { projectId: string; assets: ProjectAsset[] } }
  | { type: 'ADD_PROJECT_ASSET'; payload: { projectId: string; asset: ProjectAsset } }
  | { type: 'SET_PUBLICATION_REQUESTS'; payload: PublicationRequest[] }
  | { type: 'ADD_PUBLICATION_REQUEST'; payload: PublicationRequest }
  | { type: 'UPDATE_PUBLICATION_REQUEST'; payload: PublicationRequest }
  | { type: 'SET_LOADING'; payload: { key: keyof DualLayerState['loading']; value: boolean; projectId?: string } }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: DualLayerState = {
  projects: [],
  projectAssets: {},
  publicationRequests: [],
  loading: {
    projects: false,
    assets: {},
    requests: false
  },
  error: null
};

const dualLayerReducer = (state: DualLayerState, action: DualLayerAction): DualLayerState => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      const { [action.payload]: _, ...remainingAssets } = state.projectAssets;
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        projectAssets: remainingAssets
      };
    case 'SET_PROJECT_ASSETS':
      return {
        ...state,
        projectAssets: {
          ...state.projectAssets,
          [action.payload.projectId]: action.payload.assets
        }
      };
    case 'ADD_PROJECT_ASSET':
      return {
        ...state,
        projectAssets: {
          ...state.projectAssets,
          [action.payload.projectId]: [
            ...(state.projectAssets[action.payload.projectId] || []),
            action.payload.asset
          ]
        }
      };
    case 'SET_PUBLICATION_REQUESTS':
      return { ...state, publicationRequests: action.payload };
    case 'ADD_PUBLICATION_REQUEST':
      return {
        ...state,
        publicationRequests: [...state.publicationRequests, action.payload]
      };
    case 'UPDATE_PUBLICATION_REQUEST':
      return {
        ...state,
        publicationRequests: state.publicationRequests.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      };
    case 'SET_LOADING':
      if (action.payload.key === 'assets' && action.payload.projectId) {
        return {
          ...state,
          loading: {
            ...state.loading,
            assets: {
              ...state.loading.assets,
              [action.payload.projectId]: action.payload.value
            }
          }
        };
      }
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface DualLayerContextType extends DualLayerState {
  createProject: (designerId: string, projectData: Omit<Project, 'id' | 'designer_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (projectId: string, projectData: Partial<Omit<Project, 'id' | 'designer_id'>>, designerId: string) => Promise<void>;
  deleteProject: (projectId: string, designerId: string) => Promise<void>;
  uploadProjectAsset: (projectId: string, assetData: Omit<ProjectAsset, 'id' | 'designer_id' | 'created_at'>) => Promise<void>;
  loadProjectAssets: (projectId: string) => Promise<void>;
  submitPublicationRequest: (designerId: string, request: Omit<PublicationRequest, 'id' | 'designer_id' | 'status' | 'submitted_at' | 'created_at' | 'updated_at'>) => Promise<void>;
  loadDesignerProjects: (designerId: string) => Promise<void>;
  loadDesignerPublicationRequests: (designerId: string) => Promise<void>;
  loadPendingPublicationRequests: () => Promise<void>;
  reviewPublicationRequest: (requestId: string, adminId: string, decision: 'approved' | 'rejected' | 'under_review', notes?: string) => Promise<void>;
}

const DualLayerContext = createContext<DualLayerContextType | undefined>(undefined);

export const DualLayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dualLayerReducer, initialState);

  const loadDesignerProjects = async (designerId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'projects', value: true } });
    try {
      const projects = await DualLayerService.getDesignerProjects(designerId);
      dispatch({ type: 'SET_PROJECTS', payload: projects });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'projects', value: false } });
    }
  };

  const createProject = async (
    designerId: string,
    projectData: Omit<Project, 'id' | 'designer_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const newProject = await DualLayerService.createProject(designerId, projectData);
      if (newProject) {
        dispatch({ type: 'ADD_PROJECT', payload: newProject });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create project' });
    }
  };

  const updateProject = async (
    projectId: string,
    projectData: Partial<Omit<Project, 'id' | 'designer_id'>>,
    designerId: string
  ) => {
    try {
      const updatedProject = await DualLayerService.updateProject(projectId, projectData, designerId);
      if (updatedProject) {
        dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update project' });
    }
  };

  const deleteProject = async (projectId: string, designerId: string) => {
    try {
      const success = await DualLayerService.deleteProject(projectId, designerId);
      if (success) {
        dispatch({ type: 'DELETE_PROJECT', payload: projectId });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete project' });
    }
  };

  const loadProjectAssets = async (projectId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'assets', value: true, projectId } });
    try {
      const assets = await DualLayerService.getProjectAssets(projectId);
      dispatch({ type: 'SET_PROJECT_ASSETS', payload: { projectId, assets } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load project assets' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'assets', value: false, projectId } });
    }
  };

  const uploadProjectAsset = async (
    projectId: string,
    assetData: Omit<ProjectAsset, 'id' | 'designer_id' | 'created_at'>
  ) => {
    try {
      const asset = await DualLayerService.uploadProjectAsset(projectId, assetData);
      if (asset) {
        dispatch({ type: 'ADD_PROJECT_ASSET', payload: { projectId, asset } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to upload asset' });
    }
  };

  const loadDesignerPublicationRequests = async (designerId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'requests', value: true } });
    try {
      const requests = await DualLayerService.getDesignerPublicationRequests(designerId);
      dispatch({ type: 'SET_PUBLICATION_REQUESTS', payload: requests });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load publication requests' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'requests', value: false } });
    }
  };

  const submitPublicationRequest = async (
    designerId: string,
    request: Omit<PublicationRequest, 'id' | 'designer_id' | 'status' | 'submitted_at' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const newRequest = await DualLayerService.submitPublicationRequest(designerId, request);
      if (newRequest) {
        dispatch({ type: 'ADD_PUBLICATION_REQUEST', payload: newRequest });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit publication request' });
    }
  };

  const loadPendingPublicationRequests = async () => {
    try {
      const requests = await DualLayerService.getPendingPublicationRequests();
      dispatch({ type: 'SET_PUBLICATION_REQUESTS', payload: requests });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load pending requests' });
    }
  };

  const reviewPublicationRequest = async (
    requestId: string,
    adminId: string,
    decision: 'approved' | 'rejected' | 'under_review',
    notes?: string
  ) => {
    try {
      const success = await DualLayerService.reviewPublicationRequest(requestId, adminId, decision, notes);
      if (success) {
        // Update the request in the state
        const updatedRequest: any = {
          id: requestId,
          status: decision,
          admin_notes: notes || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId
        };
        dispatch({ type: 'UPDATE_PUBLICATION_REQUEST', payload: updatedRequest });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to review publication request' });
    }
  };

  return (
    <DualLayerContext.Provider
      value={{
        ...state,
        createProject,
        updateProject,
        deleteProject,
        uploadProjectAsset,
        loadProjectAssets,
        submitPublicationRequest,
        loadDesignerProjects,
        loadDesignerPublicationRequests,
        loadPendingPublicationRequests,
        reviewPublicationRequest
      }}
    >
      {children}
    </DualLayerContext.Provider>
  );
};

export const useDualLayer = (): DualLayerContextType => {
  const context = useContext(DualLayerContext);
  if (context === undefined) {
    throw new Error('useDualLayer must be used within a DualLayerProvider');
  }
  return context;
};