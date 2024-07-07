import { WorkPackage } from '.';

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
