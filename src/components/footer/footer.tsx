// Modules
import { type FC, useEffect, useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';

// Constants
import { type ChallengeStatus, ChallengeStatuses } from '../../constants/challenge-status';

// Context
import { useCurrentChallenge } from '../../context/current-challenge';

type Props = {
  errors?: string[];
  challengeStatus?: ChallengeStatus;
  isLoading: boolean;
  goToNextChallenge: () => void;
};

const EMPTY_ARRAY: string[] = [];
const noop = () => {};

const Footer: FC<Props> = (props) => {
  const {
    errors = EMPTY_ARRAY,
    challengeStatus = ChallengeStatuses.unavailable,
    isLoading = false,
    goToNextChallenge = noop,
  } = props;

  const { challengeId } = useCurrentChallenge();

  const [height, setHeight] = useState(150); // Default height in pixels
  const [isDragging, setIsDragging] = useState(false);

  const footerRef = useRef<HTMLDivElement>(null);

  const isError = challengeStatus === ChallengeStatuses.error;

  // Mouse event handlers for resizing
  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const onDrag = useCallback((e: MouseEvent) => {
    if (!isDragging || !footerRef.current) return;
    const newHeight = window.innerHeight - e.clientY;
    setHeight(Math.max(50, Math.min(newHeight, window.innerHeight - 150))); // Enforce min and max height
  }, [isDragging]);

  const stopDrag = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDrag);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging, onDrag]);

  return (
    <ResizableFooter ref={footerRef} height={height} isError={isError}>
      <DragHandle onMouseDown={startDrag} />

      <div className="footer-content">
        <div className="path">
          <span className="terminal-text">~/type-challenges/{challengeId ?? 'challenge'}:</span>
        </div>

        <div className="terminal-text">
          {challengeStatus === ChallengeStatuses.success ? (
            <>
              <span>success!</span>
              <NextChallengeButton onClick={goToNextChallenge}>
                Next Challenge →
              </NextChallengeButton>
            </>
          ) : challengeStatus === ChallengeStatuses.unavailable ? (
            <div className="terminal-text">Try to complete the challenge!</div>
          ) : isLoading ? (
            <div className="terminal-text">Cloning challenges... [===={'>'}       ]</div>
          ) : (
            <div>
              {errors.length > 0 ? errors.map((error, idx) => <div key={idx}>{error}</div>) : 'validation errors'}
            </div>
          )}
        </div>
      </div>
    </ResizableFooter>
  );
};

const ResizableFooter = styled.div<{ height: number; isError: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* Matches MainContent width */
  height: ${({ height }) => height}px;
  min-height: 150px;
  background-color: #1e1e1e;
  color: ${({ isError }) => (isError ? '#f44336' : '#00ff00')};
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  z-index: 15;

  .footer-content {
    overflow-y: auto;
    padding: 10px;
  }

  .path {
    margin-bottom: 10px;
  }

  .terminal-text {
    font-weight: bold;
  }
`;

const DragHandle = styled.div`
  height: 5px;
  cursor: row-resize;
  background-color: #333;
`;

const NextChallengeButton = styled.button`
  background-color: #007acc;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  border-radius: 3px;

  &:hover {
    background-color: #005f99;
  }
`;

export default Footer;