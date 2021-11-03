// Tabletable - Copyright 2021 Zeroarc Software, LLC
'use strict';

import React, { SyntheticEvent } from 'react';
import ClassNames from 'classnames';

type Props = {
  cancelAllowed: boolean,
  cancelButtonClasses?: string,
  cancelButtonIconClasses?: string,
  cancelButtonText: string,
  completeButtonClasses?: string,
  completeButtonIconClasses?: string,
  completeButtonText: string,
  nextButtonClasses?: string,
  nextButtonIconClasses?: string,
  nextButtonText: string,
  nextStepAllowed: boolean,
  onCancelClick: (e: SyntheticEvent) => void,
  onCompleteStepClick: (e: SyntheticEvent) => void,
  onNextStepClick: (e: SyntheticEvent) => void,
  onPreviousStepClick: (e: SyntheticEvent) => void,
  prevButtonClasses?: string,
  prevButtonIconClasses?: string,
  prevButtonText: string,
  prevStepAllowed: boolean,
  showCompleteButton: boolean,
};

const Buttons = ({
  cancelAllowed,
  cancelButtonClasses = 'btn btn-outline-danger',
  cancelButtonIconClasses = 'far fa-times',
  cancelButtonText,
  completeButtonClasses = 'btn btn-outline-success',
  completeButtonIconClasses = 'far fa-check',
  completeButtonText,
  nextButtonClasses = 'btn btn-outline-primary',
  nextButtonIconClasses = 'far fa-arrow-right',
  nextButtonText,
  nextStepAllowed,
  onCancelClick,
  onCompleteStepClick,
  onNextStepClick,
  onPreviousStepClick,
  prevButtonClasses = 'btn btn-outline-secondary',
  prevButtonIconClasses = 'far fa-arrow-left',
  prevButtonText,
  prevStepAllowed,
  showCompleteButton = true,
}: Props) => {

  const _nextButtonClasses = ClassNames(nextButtonClasses, {
    // Hide the next button on the last step
    'd-none': showCompleteButton
  })

  const _completeButtonClasses = ClassNames(completeButtonClasses, {
    // Hide the complete button unless we are on the last step
    'd-none': !showCompleteButton
  })

  return (
    <div className='d-flex justify-content-between align-items-end mt-3'>
      <button className={`me-auto ${cancelButtonClasses}`} disabled={!cancelAllowed} onClick={onCancelClick} tabIndex={-1}>
        <i className={cancelButtonIconClasses}></i> {cancelButtonText}
      </button>
      <button className={prevButtonClasses} disabled={!prevStepAllowed} onClick={onPreviousStepClick} tabIndex={11}>
        <i className={prevButtonIconClasses}></i> {prevButtonText}
      </button>
      <button className={`ms-3 ${_nextButtonClasses}`} disabled={!nextStepAllowed} onClick={onNextStepClick} tabIndex={10}>
        <i className={nextButtonIconClasses}></i> {nextButtonText}
      </button>
      <button className={`ms-3 ${_completeButtonClasses}`} disabled={!nextStepAllowed} onClick={onCompleteStepClick} tabIndex={10}>
        <i className={completeButtonIconClasses}></i> {completeButtonText}
      </button>
    </div>
  );
};

export default Buttons;
