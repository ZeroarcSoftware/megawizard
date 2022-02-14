// Tabletable - Copyright 2021 Zeroarc Software, LLC
'use strict';

import React, { createRef, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Immutable from 'immutable';
import ClassNames from 'classnames';

import Buttons from './Buttons';

type Props = {
  // Required
  // steps: Wizard steps config object
  steps: Immutable.List<Immutable.Map<string, any>>,
  
  // Optional

  // Optional override for complete button classes
  completeButtonClasses?: string,

  // Optional override for complete button icon classes
  completeButtonIconClasses?: string,

  // If provided, Megazwizard will not automatically advance
  // steps and instead use the provided index to display
  index?: number,

  // Optional override for next button classes
  nextButtonClasses?: string,

  // Optional override for next button icon classes
  nextButtonIconClasses?: string,

  // Optional override for previous button classes
  prevButtonClasses?: string,

  // Optional override for previous button icon classes
  prevButtonIconClasses?: string,

  // onCancel: called when the cancel button is clicked. If not provided, cancel will not be allowed
  onCancel?: (step: Immutable.Map<string,any>) => void,
  
  // onComplete: called when the final wizard complete button is clicked
  onComplete?: (step: Immutable.Map<string,any>) => void,

  // called when step index wants to change
  onStepShouldChange?: (index: number) => void,

  // called when any step changes, passes step
  onStepChanged?: (step: Immutable.Map<string,any>) => void,

  // called when any step changes, passes step
  onNextStepChanged?: (step: Immutable.Map<string,any>) => void,

  // called when any step changes, passes step
  onPreviousStepChanged?: (step: Immutable.Map<string,any>) => void,

  // called before any step changes, passes step
  onStepWillChange?: (step: Immutable.Map<string,any>) => boolean,

  // called before next step changes, passes step
  onStepWillChangeToNext?: (step: Immutable.Map<string,any>) => boolean,

  // called before previous step changes, passes step
  onStepWillChangeToPrevious?: (step: Immutable.Map<string,any>) => boolean,
} & typeof defaultProps;

const defaultProps = {
  cancelButtonText: 'Cancel',
  completeButtonText: 'Done',
  nextButtonText: 'Next',
  prevButtonText: 'Previous',
};

export const MegaWizardContainer = (props: Props) => {
  props = {...defaultProps, ...props}

  const visibleSteps = props.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));
  const stepRefs = useRef<React.RefObject<HTMLLIElement>[]>([]);
  stepRefs.current = props.steps.map((s, i) => stepRefs.current[i]! ?? createRef()).toArray();

  //#region Hooks
  
  let index = 0;
  const propsIndex = props.index;
  if (typeof propsIndex === 'number' && propsIndex < 0) {
    index = visibleSteps.count() + propsIndex;
  }
  else if (typeof propsIndex === 'number') {
    index = propsIndex;
  }

  const [currentStepIndex, setCurrentStepIndex] = useState(index);
  const [steps, setVisibleSteps] = useState(visibleSteps);
  
  const prevStepIndexRef = useRef<number>(1);
  useEffect(() => {
    prevStepIndexRef.current = currentStepIndex;
  });
  const prevStepIndex = prevStepIndexRef.current;

  // Because we have steps in state, we need watch for updates
  // and re-filter
  useEffect(() => {
    const visibleSteps = props.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

    setVisibleSteps(visibleSteps);
  }, [props.steps]);

  useEffect(() => {
    const nextIndex = props.index;
    if (typeof nextIndex === 'number') {
      const index = nextIndex < 0 ? props.steps.count() + nextIndex : nextIndex;
      setCurrentStepIndex(index);
    }
  }, [props.index]);

 
  // Check for step changes and fire optional callbacks
  useEffect(() => {
    const currentStep = steps.get(currentStepIndex, Immutable.Map()) as Immutable.Map<string, any>;
    const prevStep = steps.get(prevStepIndex, Immutable.Map());
    
    // Fire global step change callback if it exists
    currentStep && props.onStepChanged && props.onStepChanged(currentStep);

    // We went forward, fire next
    if (prevStepIndex > currentStepIndex)
      currentStep && props.onNextStepChanged && props.onNextStepChanged(currentStep);
    // We went back, fire previous
    else
      currentStep && props.onPreviousStepChanged && props.onPreviousStepChanged(currentStep);

    // Fire entry/exit steps if they exist for previous and current states
    const onExit = prevStep.get('onExit');
    if (typeof onExit === 'function') {
      onExit();
    }


    const onEnter = currentStep.get('onEnter');
    if (typeof onEnter === 'function') {
      onEnter();
    }
      
    return () => {
      const currentStep = steps.get(currentStepIndex, Immutable.Map());
      const onExit = currentStep.get('onExit');
      if (typeof onExit === 'function') {
        onExit();
      }
    };
  }, [currentStepIndex]);

  
  //#endregion

  const handleJumpStepClick = (e: SyntheticEvent, index: number) => {
    e.stopPropagation();
    const currentStep = steps.get(currentStepIndex);

    // Call onStepWillChange and if falsy return value, abort step change
    if (currentStep && props.onStepWillChange) {
      const allowed = props.onStepWillChange(currentStep);
      if (allowed === false) return;
    }

    if (typeof props.onStepShouldChange === 'function')
      props.onStepShouldChange(index);
    else
      setCurrentStepIndex(index);

    stepRefs.current[currentStepIndex].current?.scrollIntoView({behavior: 'smooth', block: 'center' });
  };

  const handlePreviousStepClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    const currentStep = steps.get(currentStepIndex);

    if (currentStepIndex > 0) {
      // Call onStepWillChange and if falsy return value, abort step change
      if (currentStep && props.onStepWillChange) {
        const allowed = props.onStepWillChange(currentStep);
        if (allowed === false) return;
      }

      // Call onStepWillChangeToPrevious and if falsy return value, abort step change
      if (currentStep && props.onStepWillChangeToPrevious) {
        const allowed = props.onStepWillChangeToPrevious(currentStep);
        if (allowed === false) return;
      }

      if (typeof props.onStepShouldChange === 'function')  
        props.onStepShouldChange(currentStepIndex - 1);
      else
        setCurrentStepIndex(currentStepIndex - 1);

      console.log('scrollz')
      stepRefs.current[currentStepIndex].current?.scrollIntoView({behavior: 'smooth', block: 'center' });
    }
  }

  const handleNextStepClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    const currentStep = steps.get(currentStepIndex);

    if (currentStepIndex < steps.count()) {
      // Call onStepWillChange and if falsy return value, abort step change
      if (currentStep && props.onStepWillChange) {
        const allowed = props.onStepWillChange(currentStep);
        if (allowed === false) return;
      }

      // Call onStepWillChangeToNext and if falsy return value, abort step change
      if (currentStep && props.onStepWillChangeToNext) {
        const allowed = props.onStepWillChangeToNext(currentStep);
        if (allowed === false) return;
      }

      if (typeof props.onStepShouldChange === 'function')  
        props.onStepShouldChange(currentStepIndex + 1);
      else
        setCurrentStepIndex(currentStepIndex + 1);

      stepRefs.current[currentStepIndex].current?.scrollIntoView({behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    const currentStep = steps.get(currentStepIndex);

    if (currentStep && props.onCancel)
      props.onCancel(currentStep);
  };

  const handleCompleteStepClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    const currentStep = steps.get(currentStepIndex);

    // Call onStepWillChange and if falsy return value, abort step change
    if (currentStep && props.onStepWillChange) {
      const allowed = props.onStepWillChange(currentStep);
      if (allowed === false) return;
    }

    // Call onStepWillChangeToNext and if falsy return value, abort step change
    if (currentStep && props.onStepWillChangeToNext) {
      const allowed = props.onStepWillChangeToNext(currentStep);
      if (allowed === false) return;
    }

    currentStep && props.onComplete && props.onComplete(currentStep);
  };

  const currentStep = steps.get(currentStepIndex);
  if (!currentStep) throw 'Invalid state, currentStep not found for index ' + currentStepIndex;

  // If defined, execute validators and check the result to determine if the step can advancex;
  const nextStepAllowed = typeof currentStep.get('nextValidator') === 'undefined' || !!currentStep.get('nextValidator');
  // In addition to the prevValidator, make sure this isn't the first step
  const prevStepAllowed = currentStepIndex !== 0 &&
    (typeof currentStep.get('prevValidator') === 'undefined' || !!currentStep.get('prevValidator'));

  const cancelAllowed = typeof currentStep.get('cancelAllowed') === 'undefined' || !!currentStep.get('cancelAllowed');

  // Build out summary column of steps
  const stepNames = steps.map((step,index) => {
    // Current step is highlighted in bold
    const nameClasses = ClassNames('list-group-item', {
      'text-bold': index === currentStepIndex
    });

    // Current step has success badge, previous steps are primary
    // future steps are default
    const numberClasses = ClassNames('badge small', {
      'bg-success': index < currentStepIndex,
      'bg-primary': index === currentStepIndex,
      'bg-light text-dark': index > currentStepIndex,
    });

    const jumpButton = currentStep.get('allowJumpFrom', false) && step.get('allowJumpTo', false)
    ? (
      <button className='btn btn-sm btn-outline-secondary float-end'
        onClick={(e: SyntheticEvent) => handleJumpStepClick(e, index)}>
        <i className='far fa-fw fa-history'></i> Jump
        </button>
    )
    : null;

    return (
      <li key={'stepName-' + index} className={nameClasses} ref={stepRefs.current[index]}>
        <span className='me-2' style={{fontSize: '1.5em'}}><span className={numberClasses}>&nbsp;{index + 1}&nbsp;</span></span> {step.get('text')}
        {jumpButton}
      </li>
    );
  });

  const display = currentStep.get('display');
  const onDisplay = typeof display === 'function' ? display() : null;

  return (
    <div className='megawizard'>
      <div className='row'>
        <div className='col-4 overflow-auto' style={{maxHeight: '50vh'}}>
          <ul className='list-group'>
            {stepNames}
          </ul>
        </div>
        <div className='col'>
          <div className='row'>
            <div className='col-12 text-center'>
              <h2>{currentStepIndex + 1}. {currentStep.get('text')}</h2>
            </div>
          </div>
          <div className='row mt-1 mb-4 justify-content-center'>
            {onDisplay}
          </div>
        </div>
      </div>
        <div className='col offset-4'>
          <div className='row'>
            <Buttons 
              cancelAllowed={cancelAllowed}
              cancelButtonText={props.cancelButtonText}
              completeButtonClasses={currentStep.get('completeButtonClasses') || props.completeButtonClasses}
              completeButtonIconClasses={currentStep.get('completeButtonIconClasses') || props.completeButtonIconClasses}
              completeButtonText={currentStep.get('completeButtonText') || props.completeButtonText}
              nextStepAllowed={nextStepAllowed}
              nextButtonClasses={currentStep.get('nextButtonClasses') || props.nextButtonClasses}
              nextButtonIconClasses={currentStep.get('nextButtonIconClasses') || props.nextButtonIconClasses}
              nextButtonText={currentStep.get('nextButtonText') || props.nextButtonText}
              onPreviousStepClick={handlePreviousStepClick}
              onCancelClick={handleCancelClick}
              onCompleteStepClick={handleCompleteStepClick}
              onNextStepClick={handleNextStepClick}
              prevStepAllowed={prevStepAllowed}
              prevButtonClasses={currentStep.get('prevButtonClasses') || props.prevButtonClasses}
              prevButtonIconClasses={currentStep.get('prevButtonIconClasses') || props.prevButtonIconClasses}
              prevButtonText={currentStep.get('prevButtonText') || props.prevButtonText}
              showCompleteButton={currentStepIndex === steps.count() -1}
            />
        </div>
      </div>
    </div>
  );
};

MegaWizardContainer.defaultProps = defaultProps;

export default MegaWizardContainer;