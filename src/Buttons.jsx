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
  onCompleteStepClick: (e: SyntheticInputEvent) => void,
  onNextStepClick: (e: SyntheticInputEvent) => void,
  onPreviousStepClick: (e: SyntheticInputEvent) => void,
  prevButtonClasses?: string,
  prevButtonIconClasses?: string,
  prevButtonText: string,
  prevStepAllowed: bool,
  showCompleteButton: bool,
};

const Buttons = ({
  showCompleteButton = true,
  completeButtonClasses = 'btn btn-danger', 
  completeButtonIconClasses = 'fa fa-check',
  completeButtonText,
  nextButtonClasses = 'btn btn-white', 
  nextButtonIconClasses = 'fa fa-arrow-right',
  nextButtonText,
  nextStepAllowed,
  onCompleteStepClick,
  onNextStepClick,
  onPreviousStepClick,
  prevButtonClasses = 'btn btn-white', 
  prevButtonIconClasses = 'fa fa-arrow-left', 
  prevButtonText,
  prevStepAllowed,
}: Props) => {

  const _nextButtonClasses = ClassNames(nextButtonClasses, {
    // Hide the next button on the last step
    'hidden': showCompleteButton
  })

  const _completeButtonClasses = ClassNames(completeButtonClasses, {
    // Hide the complete button unless we are on the last step
    'hidden': !showCompleteButton
  })

  return (
    <div className='row' style={{ marginTop: '2em' }}>
      <div className='col-sm-6'>
        <button className={prevButtonClasses} disabled={!prevStepAllowed} onClick={onPreviousStepClick}>
          <i className={prevButtonIconClasses}></i> {prevButtonText}
        </button>
      </div>
      <div className='col-sm-6 text-right'>
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
