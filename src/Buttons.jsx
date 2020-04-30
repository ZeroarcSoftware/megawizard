// @flow
// MegaWizard - Copyright 2017 Zeroarc Software, LLC
'use strict';

import React from 'react';
import ClassNames from 'classnames';

type Props = {
  cancelAllowed: bool,
  cancelButtonClasses?: string,
  cancelButtonIconClasses?: string,
  cancelButtonText: string,
  completeButtonClasses?: string,
  completeButtonIconClasses?: string,
  completeButtonText: string,
  nextButtonClasses?: string,
  nextButtonIconClasses?: string,
  nextButtonText: string,
  nextStepAllowed: bool,
  onCancelClick: (e: SyntheticInputEvent<*>) => void,
  onCompleteStepClick: (e: SyntheticInputEvent<*>) => void,
  onNextStepClick: (e: SyntheticInputEvent<*>) => void,
  onPreviousStepClick: (e: SyntheticInputEvent<*>) => void,
  prevButtonClasses?: string,
  prevButtonIconClasses?: string,
  prevButtonText: string,
  prevStepAllowed: bool,
  showCompleteButton: bool,
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
      <button className={`mr-auto ${cancelButtonClasses}`} disabled={!cancelAllowed} onClick={onCancelClick} tabIndex={-1}>
        <i className={cancelButtonIconClasses}></i> {cancelButtonText}
      </button>
      <button className={prevButtonClasses} disabled={!prevStepAllowed} onClick={onPreviousStepClick} tabIndex={11}>
        <i className={prevButtonIconClasses}></i> {prevButtonText}
      </button>
      <button className={`ml-3 ${_nextButtonClasses}`} disabled={!nextStepAllowed} onClick={onNextStepClick} tabIndex={10}>
        <i className={nextButtonIconClasses}></i> {nextButtonText}
      </button>
      <button className={`ml-3 ${_completeButtonClasses}`} disabled={!nextStepAllowed} onClick={onCompleteStepClick} tabIndex={10}>
        <i className={completeButtonIconClasses}></i> {completeButtonText}
      </button>
    </div>
  );
};

export default Buttons;
