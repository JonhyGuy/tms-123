import { IBox } from './box';
import { IEmployee } from './employee';
import { ITravelStatus } from './travel-status';
import { ITruck } from './truck';

export interface ITravel {
  id?: any;
  operator: Partial<IEmployee>;
  box: Partial<IBox>;
  truck: Partial<ITruck>;
  // GeoJson type
  locations: {
    origin: { type: 'Point', coordinates: number[] },
    destination: { type: 'Point', coordinates: number[] },
  };
  status: Partial<ITravelStatus>[];
  currentStatus: any;
  comments: string;
}
