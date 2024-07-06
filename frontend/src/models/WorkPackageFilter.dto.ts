export interface WorkPackageFilter {
  startTime?: Date;
  endTime?: Date;
  registrations?: string[];
  stations?: string[];
  statuses?: string[];
  areas?: string[];
  namePattern?: string;
  limit?: number;
}
