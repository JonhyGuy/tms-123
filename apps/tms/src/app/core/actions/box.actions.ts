import { QueryParamsModel } from '@crud';
import { BoxModel } from '@models';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';

export enum BoxActionTypes {
  CreateBox = '[Edit Box Component] Create Box ',
  CreateBoxError = '[Edit Box Component] Create Box Error',
  CreateBoxSuccess = '[Edit Box Component] Create Box Success',
  BoxesStatusUpdated = '[Boxes List Page] Boxes Status Updated',
  UpdateBox = '[Edit Box Component] Update Box ',
  UpdateBoxSuccess = '[Edit Box Component] Update Box Success',
  DeleteOneBox = '[Boxes List Page] Delete One Box ',
  DeleteManyBoxes = '[Boxes List Page] Delete Many Selected Boxes ',
  RequestBoxesPage = '[Boxes List Page] Request Boxes Page ',
  LoadBoxesPage = '[Boxes API] Load Boxes Page ',
  CancellBoxesPage = '[Boxes API] Cancell Boxes Page ',
  BoxesPageToggleLoading = '[Boxes] Boxes Page Toggle Loading',
  BoxesActionToggleLoading = '[Boxes] Boxes Action Toggle Loading',
}

export class CreateBox implements Action {
  readonly type = BoxActionTypes.CreateBox;
  constructor(public payload: { box: BoxModel }) { }
}
export class CreateBoxError implements Action {
  readonly type = BoxActionTypes.CreateBoxError;
  constructor(public payload: { isError: any }) { }
}

export class CreateBoxSuccess implements Action {
  readonly type = BoxActionTypes.CreateBoxSuccess;
  constructor(public payload: { box: BoxModel }) { }
}

export class UpdateBox implements Action {
  readonly type = BoxActionTypes.UpdateBox;
  constructor(public payload: {
    partialBox: Update<BoxModel>, // For State update
    box: BoxModel // For Server update (through service)
  }) { }
}

export class UpdateBoxSuccess implements Action {
  readonly type = BoxActionTypes.UpdateBoxSuccess;
  constructor(public payload: {
    partialBox: Update<BoxModel>, // For State update
    box: BoxModel // For Server update (through service)
  }) { }
}

export class BoxesStatusUpdated implements Action {
  readonly type = BoxActionTypes.BoxesStatusUpdated;
  constructor(public payload: {
      boxes: BoxModel[],
      status: number
  }) { }
}

export class DeleteOneBox implements Action {
  readonly type = BoxActionTypes.DeleteOneBox;
  constructor(public payload: {
    id: number
  }) { }
}

export class DeleteManyBoxes implements Action {
  readonly type = BoxActionTypes.DeleteManyBoxes;
  constructor(public payload: {
    ids: number[]
  }) { }
}

export class RequestBoxesPage implements Action {
  readonly type = BoxActionTypes.RequestBoxesPage;
  constructor(public payload: {
    page: QueryParamsModel
  }) { }
}

export class LoadBoxesPage implements Action {
  readonly type = BoxActionTypes.LoadBoxesPage;
  constructor(public payload: {
    boxes: BoxModel[],
    totalCount: number,
    page: QueryParamsModel
  }) { }
}

export class CancellBoxesPage implements Action {
  readonly type = BoxActionTypes.CancellBoxesPage;
}

export class BoxesPageToggleLoading implements Action {
  readonly type = BoxActionTypes.BoxesPageToggleLoading;
  constructor(public payload: {
    isLoading: boolean
  }) { }
}

export class BoxesActionToggleLoading implements Action {
  readonly type = BoxActionTypes.BoxesActionToggleLoading;
  constructor(public payload: {
    isLoading: boolean
  }) { }
}

export type BoxActions =
  | CreateBox
  | UpdateBox
  | UpdateBoxSuccess
  | DeleteOneBox
  | DeleteManyBoxes
  | BoxesStatusUpdated
  | RequestBoxesPage
  | LoadBoxesPage
  | CancellBoxesPage
  | BoxesPageToggleLoading
  | BoxesActionToggleLoading
  | CreateBoxError
  | CreateBoxSuccess
  ;
