// @flow
// MegaWizard - Copyright 2018 Zeroarc Software, LLC
'use strict';

import React from 'react';
import * as Immutable from 'immutable';
import ClassNames from 'classnames';
import Autobind from 'autobind-decorator';

import Buttons from './Buttons';

type Props = {
  // Required
  // steps: Wizard steps config object
  steps: Immutable.List<*>,
  
  // Optional

  // Override for complete button text
  completeButtonText: string,

  // Optional override for complete button classes
  completeButtonClasses?: string,

  // Optional override for complete button icon classes
  completeButtonIconClasses?: string,

  // If provided, Megazwizard will not automatically advance
  // steps and instead use the provided index to display
  index?: number,

  // Override for next button text
  nextButtonText: string,

  // Optional override for next button classes
  nextButtonClasses?: string,

  // Optional override for next button icon classes
  nextButtonIconClasses?: string,

  // Override for previous button text
  prevButtonText: string,

  // Optional override for previous button classes
  prevButtonClasses?: string,

  // Optional override for previous button icon classes
  prevButtonIconClasses?: string,

  // onComplete: called when the final wizard complete button is clicked
  onComplete?: (Immutable.Map<string,*>) => void,

  // called when step index wants to change
  onStepShouldChange?: (number) => void,

  // called when any step changes, passes step
  onStepChanged?: (Immutable.Map<string,*>) => void,

  // called when any step changes, passes step
  onNextStepChanged?: (Immutable.Map<string,*>) => void,

  // called when any step changes, passes step
  onPreviousStepChanged?: (Immutable.Map<string,*>) => void,

  // called before any step changes, passes step
  onStepWillChange?: (Immutable.Map<string,*>) => void,

  // called before next step changes, passes step
  onStepWillChangeToNext?: (Immutable.Map<string,*>) => void,

  // called before previous step changes, passes step
  onStepWillChangeToPrevious?: (Immutable.Map<string,*>) => void,
};

type State = {
  currentStepIndex: number,
  steps: Immutable.List<Immutable.Map<string, *>>,
};

@Autobind
export default class MegaWizardContainer extends React.Component<Props,State> {
  static defaultProps: {
    completeButtonText: string,
    nextButtonText: string,
    prevButtonText: string,
  };

  constructor(props: Props) {
    super(props);

    const visibleSteps = props.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

    let index = 0;
    const propsIndex = props.index;
    if (typeof propsIndex === 'number' && propsIndex < 0) {
      index = visibleSteps.count() + propsIndex;
    }
    else if (typeof propsIndex === 'number') {
      index = propsIndex;
    }

    this.state = {
      currentStepIndex: index,
      steps: visibleSteps,
    };
  }

  // Because we have steps in state, we need watch for updates
  // and re-filter
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      const visibleSteps = nextProps.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

      this.setState({
        steps: visibleSteps,
      });
    }

    if (nextProps.index !== this.props.index) {
      const nextIndex = nextProps.index;
      if (typeof nextIndex === 'number') {
        const index = nextIndex < 0 ? nextProps.steps.count() + nextIndex : nextIndex;
        this.setState({ currentStepIndex: index });
      }
    }
  }

  // Check to see if we have an onEnter callback defined on first step
  componentDidMount() {
    const currentStep = this.state.steps.get(this.state.currentStepIndex, Immutable.Map());
    const onEnter =  currentStep.get('onEnter');
    if (typeof onEnter === 'function')
      onEnter();
  }

  // Check to see if we have an onExit callback defined on current step
  // before unmounting
  componentWillUnmount() {
    const currentStep = this.state.steps.get(this.state.currentStepIndex, Immutable.Map());
    const onExit = currentStep.get('onExit');
    if (typeof onExit === 'function')
      onExit();
  }

  // Check for step changes and fire optional callbacks
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.currentStepIndex !== this.state.currentStepIndex) {
      const currentStepIndex = this.state.currentStepIndex;
      const currentStep = this.state.steps.get(currentStepIndex, Immutable.Map());

      const prevStepIndex = prevState.currentStepIndex;
      const prevStep = this.state.steps.get(prevStepIndex, Immutable.Map());

      // Fire global step change callback if it exists
      currentStep && this.props.onStepChanged && this.props.onStepChanged(currentStep);

      // We went forward, fire next
      if (prevStepIndex > currentStepIndex)
        currentStep && this.props.onNextStepChanged && this.props.onNextStepChanged(currentStep);
      // We went back, fire previous
      else
        currentStep && this.props.onPreviousStepChanged && this.props.onPreviousStepChanged(currentStep);

      // Fire entry/exit steps if they exist for previous and current states
      const onExit = prevStep.get('onExit');
      if (typeof onExit === 'function')
        onExit();

      const onEnter = currentStep.get('onEnter');
      if (typeof onEnter === 'function')
        onEnter();
    }
  }

  render() {
    const currentStep = this.state.steps.get(this.state.currentStepIndex);
    if (!currentStep) throw 'Invalid state, currentStep not found for index ' + this.state.currentStepIndex;

    // If defined, execute validators and check the result to determine if the step can advancex;
    const nextStepAllowed = typeof currentStep.get('nextValidator') === 'undefined' || !!currentStep.get('nextValidator');
    // In addition to the prevValidator, make sure this isn't the first step
    const prevStepAllowed = this.state.currentStepIndex !== 0 &&
      (typeof currentStep.get('prevValidator') === 'undefined' || !!currentStep.get('prevValidator'));

    // Build out summary column of steps
    const stepNames = this.state.steps.map((step,index) => {
      // Current step is highlighted in bold
      const nameClasses = ClassNames('list-group-item', {
        'text-bold': index === this.state.currentStepIndex
      });

      // Current step has success badge, previous steps are primary
      // future steps are default
      const numberClasses = ClassNames('badge', {
        'badge-primary': index < this.state.currentStepIndex,
        'badge-success': index === this.state.currentStepIndex
      });

      const jumpButton = currentStep.get('allowJumpFrom', false) && step.get('allowJumpTo', false)
      ? (
        <button className='btn btn-sm btn-secondary pull-right'
          onClick={(e: SyntheticInputEvent<*>) => this.handleJumpStepClick(e, index)}>
          <i className='far fa-fw fa-history'></i> Jump
          </button>
      )
      : null;

      return (
        <li key={'stepName-' + index} className={nameClasses}>
          <span className={numberClasses}>{index + 1}</span><span className='room-left'> {step.get('text')}</span> 
          {jumpButton}
        </li>
      );
    });

    const display = currentStep.get('display');
    const onDisplay = typeof display === 'function' ? display() : null;

    return (
      <div className='megawizard'>
        <div className='row'>
          <div className='col-4'>
            <ul className='list-group'>
              {stepNames}
            </ul>
          </div>
          <div className='col'>
            <div className='row'>
              <div className='col-12 text-center'>
                <h2>{this.state.currentStepIndex + 1}. {currentStep.get('text')}</h2>
              </div>
            </div>
            <div className='row mt-1'>
              {onDisplay}
            </div>
            <Buttons 
              completeButtonClasses={currentStep.get('completeButtonClasses') || this.props.completeButtonClasses}
              completeButtonIconClasses={currentStep.get('completeButtonIconClasses') || this.props.completeButtonIconClasses}
              completeButtonText={currentStep.get('completeButtonText') || this.props.completeButtonText}
              nextStepAllowed={nextStepAllowed}
              nextButtonClasses={currentStep.get('nextButtonClasses') || this.props.nextButtonClasses}
              nextButtonIconClasses={currentStep.get('nextButtonIconClasses') || this.props.nextButtonIconClasses}
              nextButtonText={currentStep.get('nextButtonText') || this.props.nextButtonText}
              onPreviousStepClick={this.handlePreviousStepClick}
              onNextStepClick={this.handleNextStepClick}
              onCompleteStepClick={this.handleCompleteStepClick}
              prevStepAllowed={prevStepAllowed}
              prevButtonClasses={currentStep.get('prevButtonClasses') || this.props.prevButtonClasses}
              prevButtonIconClasses={currentStep.get('prevButtonIconClasses') || this.props.prevButtonIconClasses}
              prevButtonText={currentStep.get('prevButtonText') || this.props.prevButtonText}
              showCompleteButton={this.state.currentStepIndex === this.state.steps.count() -1}
            />
          </div>
        </div>
      </div>
    );
  }

  //
  // Custom methods
  //
  handleJumpStepClick(e: SyntheticInputEvent<*>, index: number) {
    e.stopPropagation();
    const currentStep = this.state.steps.get(this.state.currentStepIndex);

    // Call onStepWillChange and if falsy return value, abort step change
    if (currentStep && this.props.onStepWillChange) {
      const allowed = this.props.onStepWillChange(currentStep);
      if (allowed === false) return;
    }

    if (typeof this.props.onStepShouldChange === 'function')
      this.props.onStepShouldChange(index);
    else
      this.setState({ currentStepIndex: index });
  }

  handlePreviousStepClick(e: SyntheticInputEvent<*>) {
    e.stopPropagation();
    const currentStep = this.state.steps.get(this.state.currentStepIndex);

    if (this.state.currentStepIndex > 0) {
      // Call onStepWillChange and if falsy return value, abort step change
      if (currentStep && this.props.onStepWillChange) {
        const allowed = this.props.onStepWillChange(currentStep);
        if (allowed === false) return;
      }

      // Call onStepWillChangeToPrevious and if falsy return value, abort step change
      if (currentStep && this.props.onStepWillChangeToPrevious) {
        const allowed = this.props.onStepWillChangeToPrevious(currentStep);
        if (allowed === false) return;
      }

      if (typeof this.props.onStepShouldChange === 'function')  
        this.props.onStepShouldChange(this.state.currentStepIndex - 1);
      else
        this.setState({currentStepIndex: this.state.currentStepIndex - 1});
    }
  }

  handleNextStepClick(e: SyntheticInputEvent<*>) {
    e.stopPropagation();
    const currentStep = this.state.steps.get(this.state.currentStepIndex);

    if (this.state.currentStepIndex < this.state.steps.count()) {
      // Call onStepWillChange and if falsy return value, abort step change
      if (currentStep && this.props.onStepWillChange) {
        const allowed = this.props.onStepWillChange(currentStep);
        if (allowed === false) return;
      }

      // Call onStepWillChangeToNext and if falsy return value, abort step change
      if (currentStep && this.props.onStepWillChangeToNext) {
        const allowed = this.props.onStepWillChangeToNext(currentStep);
        if (allowed === false) return;
      }

      if (typeof this.props.onStepShouldChange === 'function')  
        this.props.onStepShouldChange(this.state.currentStepIndex + 1);
      else
        this.setState({currentStepIndex: this.state.currentStepIndex + 1});
    }
  }

  handleCompleteStepClick(e: SyntheticInputEvent<*>) {
    e.stopPropagation();
    const currentStep = this.state.steps.get(this.state.currentStepIndex);

    // Call onStepWillChange and if falsy return value, abort step change
    if (currentStep && this.props.onStepWillChange) {
      const allowed = this.props.onStepWillChange(currentStep);
      if (allowed === false) return;
    }

    // Call onStepWillChangeToNext and if falsy return value, abort step change
    if (currentStep && this.props.onStepWillChangeToNext) {
      const allowed = this.props.onStepWillChangeToNext(currentStep);
      if (allowed === false) return;
    }

    currentStep && this.props.onComplete && this.props.onComplete(currentStep);
  }
}

MegaWizardContainer.defaultProps = {
  completeButtonText: 'Done',
  nextButtonText: 'Next',
  prevButtonText: 'Previous',
};