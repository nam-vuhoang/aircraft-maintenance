import { WorkPackage } from '../models';

/**
 * WorkPackage DTO (Data Transfer Object) interface, used for retrieving flight data from the server.
 */
export interface WorkPackageDto {
  id: string;
  registration: string;
  name: string;
  station: string;
  status: string;
  area: string;
  startTime: string;
  endTime: string;
}

export const convertWorkPackgeDtoToWorkPackage = (json: WorkPackageDto): WorkPackage => {
  return {
    ...json,
    startTime: new Date(json.startTime),
    endTime: new Date(json.endTime),
  };
};
