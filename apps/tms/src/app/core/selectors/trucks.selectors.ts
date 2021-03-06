import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { TruckModel } from '@tms/models';
import { TrucksState } from '@tms/reducers';
import { each } from 'lodash';

export const selectTruckState = createFeatureSelector<TrucksState>('trucks');

export const selectTruckById = (truckId: string) =>
  createSelector(
    selectTruckState,
    (trucksState) => trucksState.entities[truckId]
  );

export const selectTrucksPageLoading = createSelector(
  selectTruckState,
  (trucksState) => trucksState.listLoading
);

export const selectTrucksActionLoading = createSelector(
  selectTruckState,
  (customersState) => customersState.actionsloading
);

export const selectTrucksPageLastQuery = createSelector(
  selectTruckState,
  (trucksState) => trucksState.lastQuery
);

export const selectLastCreatedTruckId = createSelector(
  selectTruckState,
  (trucksState) => trucksState.lastCreatedTruckId
);

export const selectTrucksInitWaitingMessage = createSelector(
  selectTruckState,
  (trucksState) => trucksState.showInitWaitingMessage
);

export const selectTrucksInStore = createSelector(
  selectTruckState,
  (trucksState) => {
    const items: TruckModel[] = [];
    each(trucksState.entities, (element) => {
      items.push(element);
    });
    const httpExtension = new HttpExtenstionsModel();
    const result: TruckModel[] = httpExtension.sortArray(
      items,
      trucksState.lastQuery.sortField,
      trucksState.lastQuery.sortOrder
    );
    return new QueryResultsModel(result, trucksState.totalCount, '');
  }
);

export const selectHasTrucksInStore = createSelector(
  selectTrucksInStore,
  (queryResult) => {
    if (!queryResult.totalCount) {
      return false;
    }
    return true;
  }
);
