import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { ModelById } from 'decentraland-dapps/dist/lib/types'
import { Project } from 'modules/project/types'
import {
  CreateProjectAction,
  CREATE_PROJECT,
  EDIT_PROJECT_REQUEST,
  EDIT_PROJECT_SUCCESS,
  EDIT_PROJECT_FAILURE,
  EditProjectRequestAction,
  EditProjectSuccessAction,
  EditProjectFailureAction,
  DeleteProjectAction,
  DELETE_PROJECT,
  EDIT_PROJECT_THUMBNAIL,
  EditProjectThumbnailAction,
  ToggleAssetPackAction,
  TOGGLE_ASSET_PACK
} from 'modules/project/actions'

export type ProjectState = {
  data: ModelById<Project>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: ProjectState = {
  data: {},
  loading: [],
  error: null
}

export type ProjectReducerAction =
  | CreateProjectAction
  | EditProjectRequestAction
  | EditProjectSuccessAction
  | EditProjectFailureAction
  | EditProjectThumbnailAction
  | DeleteProjectAction
  | ToggleAssetPackAction

export const projectReducer = (state = INITIAL_STATE, action: ProjectReducerAction): ProjectState => {
  switch (action.type) {
    case CREATE_PROJECT: {
      const { project } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          [project.id]: { ...project }
        }
      }
    }
    case EDIT_PROJECT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case EDIT_PROJECT_SUCCESS: {
      const { id, project } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          [id]: { ...state.data[id], ...project }
        },
        loading: loadingReducer(state.loading, action)
      }
    }
    case EDIT_PROJECT_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case EDIT_PROJECT_THUMBNAIL: {
      const { id, thumbnail } = action.payload

      return {
        ...state,
        data: {
          ...state.data,
          [id]: { ...state.data[id], thumbnail }
        }
      }
    }
    case DELETE_PROJECT: {
      const { project } = action.payload
      const newState = {
        ...state,
        data: {
          ...state.data
        }
      }
      delete newState.data[project.id]
      return newState
    }
    case TOGGLE_ASSET_PACK: {
      const { project, assetPackIds, enabled } = action.payload
      // remove toggled asset packs
      const oldAssetPackIds = project.assetPackIds || []
      let newAssetPackIds = oldAssetPackIds.filter(id => assetPackIds.indexOf(id) === -1) // !includes
      if (enabled) {
        // if enabled, add the new ones
        newAssetPackIds = [...newAssetPackIds, ...assetPackIds]
      }
      return {
        ...state,
        data: {
          ...state.data,
          [project.id]: {
            ...state.data[project.id],
            assetPackIds: newAssetPackIds
          }
        }
      }
    }
    default:
      return state
  }
}
