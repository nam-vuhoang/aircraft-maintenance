import { ReactNode } from 'react';
import ErrorPanel from './ErrorPanel';
import InfoPanel from './InfoPanel';
import SuccessPanel from './SuccessPanel';
import WarningPanel from './WarningPanel';
import { AlertProps } from '@chakra-ui/react';

export interface AppStatus {
  error?: Error | ReactNode;
  warning?: ReactNode;
  info?: ReactNode;
  isLoading?: boolean;
  success?: ReactNode;
}

interface AppStatusPanelProps extends AlertProps {
  appStatus: AppStatus;
}

/**
 * Render an AppStatus panel
 * @param param0
 * @returns
 */
const AppStatusPanel: React.FC<AppStatusPanelProps> = ({ appStatus, ...alertProps }) => {
  return (
    <>
      {appStatus.error && <ErrorPanel error={appStatus.error} {...alertProps} />}
      {appStatus.warning && <WarningPanel message={appStatus.warning} {...alertProps} />}
      {appStatus.info && <InfoPanel message={appStatus.info} {...alertProps} />}
      {appStatus.isLoading && <InfoPanel message="Fetching data..." {...alertProps} />}
      {appStatus.success && <SuccessPanel message={appStatus.success} {...alertProps} />}
    </>
  );
};

export default AppStatusPanel;
