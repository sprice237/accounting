import Modal from '@mui/material/Modal';
import { FC, VFC } from 'react';
import { CenterContent } from './CenterContent';

export const LoadingSpinner: VFC = () => (
  <div style={{ display: 'inline-block' }} className="loading" />
);

export const LoadingModal: VFC = () => {
  return (
    <Modal open>
      {/* Fragment is here to prevent MaterialUI error relating to tab index */}
      <>
        <CenterContent>
          <LoadingSpinner />
        </CenterContent>
      </>
    </Modal>
  );
};

export const LoadingOverlay: FC<{ isLoading: boolean }> = ({ isLoading, children }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>{children}</div>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
