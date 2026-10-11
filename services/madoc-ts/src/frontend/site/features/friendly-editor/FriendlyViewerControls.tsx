import React from 'react';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '../../../shared/icons/HomeIcon';
import { MinusIcon } from '../../../shared/icons/MinusIcon';
import { PlusIcon } from '../../../shared/icons/PlusIcon';
import { RotateIcon } from '../../../shared/icons/RotateIcon';

interface FriendlyViewerControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onHome: () => void;
  onRotate?: () => void;
}

const buttonClasses =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fe-accent)] [&_svg]:h-5 [&_svg]:w-5';

export function FriendlyViewerControls({ onZoomIn, onZoomOut, onHome, onRotate }: FriendlyViewerControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
      <button
        type="button"
        className={buttonClasses}
        onClick={onZoomIn}
        aria-label={t('atlas__zoom_in', { defaultValue: 'Zoom in' })}
      >
        <PlusIcon />
      </button>
      <button
        type="button"
        className={buttonClasses}
        onClick={onZoomOut}
        aria-label={t('atlas__zoom_out', { defaultValue: 'Zoom out' })}
      >
        <MinusIcon />
      </button>
      <button
        type="button"
        className={buttonClasses}
        onClick={onHome}
        aria-label={t('atlas__zoom_home', { defaultValue: 'Home' })}
      >
        <HomeIcon />
      </button>
      {onRotate ? (
        <button
          type="button"
          className={buttonClasses}
          onClick={onRotate}
          aria-label={t('atlas__rotate', { defaultValue: 'Rotate' })}
        >
          <RotateIcon />
        </button>
      ) : null}
    </div>
  );
}
