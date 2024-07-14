import React, { ReactNode } from 'react';
import styles from './InlineIcon.module.scss';

interface InlineIconProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const InlineIcon: React.FC<InlineIconProps> = ({ children, style }) => (
  <span className={styles.inlineIcon} style={style}>
    {children}
  </span>
);

export default InlineIcon;
