import { AVIABILITY_STATUS } from '@tms/enums';

export class TireTable {
  public static tires: any = [{
    id: 1,
    serialNumber: '1001',
    rangeTraveled: 123,
    status: AVIABILITY_STATUS.AVAILABLE
  },
  {
    id: 2,
    serialNumber: '1002',
    rangeTraveled: 123,
    status: AVIABILITY_STATUS.AVAILABLE
  },
  ];
}
