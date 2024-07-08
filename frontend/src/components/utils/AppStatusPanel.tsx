import ErrorPanel from './ErrorPanel';
import InfoPanel from './InfoPanel';
import SuccessPanel from './SuccessPanel';
import WarningPanel from './WarningPanel';

export interface AppStatus {
  success?: string;
  warning?: string;
  info?: string;
  error?: Error | string;
}

interface AppStatusPanelProps {
  status: AppStatus;
}

/**
 * Render an AppStatus panel
 * @param param0
 * @returns
 */
const AppStatusPanel: React.FC<AppStatusPanelProps> = ({ status }) => {
  return (
    <>
      {status.info && <InfoPanel message={status.info} />}
      {status.success && <SuccessPanel message={status.success} />}
      {status.warning && <WarningPanel message={status.warning} />}
      {status.error && <ErrorPanel error={status.error} />}
    </>
  );
};

export default AppStatusPanel;
