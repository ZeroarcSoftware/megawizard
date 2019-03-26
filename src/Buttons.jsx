// @flow
// MegaWizard - Copyright 2017 Zeroarc Software, LLC
'use strict';

import React from 'react';
import ClassNames from 'classnames';

type Props = {
  completeButtonClasses?: string,
  completeButtonIconClasses?: string,
  completeButtonText: string,
  nextButtonClasses?: string,
  nextButtonIconClasses?: string,
  nextButtonText: string,
  nextStepAllowed: bool,
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
  showCompleteButton = true,
  completeButtonClasses = 'btn btn-outline-danger', 
  completeButtonIconClasses = 'far fa-check',
  completeButtonText,
  nextButtonClasses = 'btn btn-outline-secondary', 
  nextButtonIconClasses = 'far fa-arrow-right',
  nextButtonText,
  nextStepAllowed,
  onCompleteStepClick,
  onNextStepClick,
  onPreviousStepClick,
  prevButtonClasses = 'btn btn-outline-secondary', 
  prevButtonIconClasses = 'far fa-arrow-left', 
  prevButtonText,
  prevStepAllowed,
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
    <div className='row justify-content-between'>
      <div className='col'>
        <button className={prevButtonClasses} disabled={!prevStepAllowed} onClick={onPreviousStepClick}>
          <i className={prevButtonIconClasses}></i> {prevButtonText}
        </button>
      </div>
      <div className='col text-right'>
        <button className={_nextButtonClasses} disabled={!nextStepAllowed} onClick={onNextStepClick}>
          <i className={nextButtonIconClasses}></i> {nextButtonText}
        </button>
        <button className={_completeButtonClasses} disabled={!nextStepAllowed} onClick={onCompleteStepClick}>
          <i className={completeButtonIconClasses}></i> {completeButtonText}
        </button>
      </div>
    </div>
  );
};

export default Buttons;
