// @flow
// MegaWizard - Copyright 2017 Zeroarc Software, LLC
'use strict';

import React from 'react';
import ReactShallowCompare from 'react-addons-shallow-compare';
import * as Immutable from 'immutable';
import ClassNames from 'classnames';
import Autobind from 'autobind-decorator';

// Local
import Buttons from './Buttons';

type Props = {
  // Required
  // steps: Wizard steps config object
  steps: Immutable.List<*>,
  // Optional override for complete button text
  completeButtonText: string,
  // Optional override for next button text
  nextButtonText: string,
  // Optional override for previous button text
  prevButtonText: string,

  // Optional
  // onComplete: called when the final wizard complete button is clicked
  onComplete?: (Immutable.Map<string,*>) => void,

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

  // Optional override for previous button classes
  prevButtonClasses?: () => void,

  // Optional override for next button classes
  nextButtonClasses?: string,

  // Optional override for complete button classes
  completeButtonClasses?: string,
};

type State = {
  currentStep: Immutable.Map<string,*>,
  steps: Immutable.List<*>,
};

@Autobind
export default class MegaWizardContainer extends React.Component {
  props: Props;
  state: State;

  static defaultProps: {
    completeButtonText: string,
    nextButtonText: string,
    prevButtonText: string,
  };

  constructor(props: Props) {
    super(props);

    const visibleSteps = props.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

    this.state = {
      currentStep: visibleSteps.get(0),
      steps: visibleSteps,
    };
  }

  // Because we have steps in state, we need watch for updates
  // and re-filter
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      const currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

      const visibleSteps = nextProps.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

      this.setState({
        currentStep: visibleSteps.get(currentStepIndex),
        steps: visibleSteps,
      });
    }
  }

  // Check to see if we have an onEnter callback defined on first step
  componentDidMount() {
    this.state.currentStep.get('onEnter') && this.state.currentStep.get('onEnter')();
  }

  // Check to see if we have an onExit callback defined on current step
  // before unmounting
  componentWillUnmount() {
    this.state.currentStep.get('onExit') && this.state.currentStep.get('onExit')();
  }

  // Check for pending step changes and fire optional callbacks
  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.currentStep.get('name') !== this.state.currentStep.get('name')) {
      // Fire global step change callback if it exists
      this.props.onStepWillChange && this.props.onStepWillChange(this.state.currentStep);

      const currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);
      const nextStepIndex = nextState.steps.findIndex(s => s === nextState.currentStep);

      // We are going forward, fire next
      if (currentStepIndex < nextStepIndex)
        this.props.onStepWillChangeToNext && this.props.onStepWillChangeToNext(this.state.currentStep);
      // We are going back, fire previous
      else
        this.props.onStepWillChangeToPrevious && this.props.onStepWillChangeToPrevious(this.state.currentStep);
    }
  }

  // Check for step changes and fire optional callbacks
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.currentStep.get('name') !== this.state.currentStep.get('name')) {
      // Fire global step change callback if it exists
      this.props.onStepChanged && this.props.onStepChanged(this.state.currentStep);

      const currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);
      const prevStepIndex = prevState.steps.findIndex(s => s === prevState.currentStep);

      // We went forward, fire next
      if (prevStepIndex > currentStepIndex)
        this.props.onNextStepChanged && this.props.onNextStepChanged(this.state.currentStep);
      // We went back, fire previous
      else
        this.props.onPreviousStepChanged && this.props.onPreviousStepChanged(this.state.currentStep);

      // Fire entry/exit steps if they exist for previous and current states
      prevState.currentStep.get('onExit') && prevState.currentStep.get('onExit')();
      this.state.currentStep.get('onEnter') && this.state.currentStep.get('onEnter')();
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return ReactShallowCompare(this, nextProps, nextState);
  }

  render() {
    const currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

    // If defined, execute validators and check the result to determine if the step can advancex;
    const nextStepAllowed = typeof this.state.currentStep.get('nextValidator') === 'undefined' || !!this.state.currentStep.get('nextValidator');
    // In addition to the prevValidator, make sure this isn't the first step
    const prevStepAllowed = currentStepIndex !== 0 &&
      (typeof this.state.currentStep.get('prevValidator') === 'undefined' || !!this.state.currentStep.get('prevValidator'));

    // Build out summary column of steps
    const stepNames = this.state.steps.map((step,index) => {
      // Current step is highlighted in bold
      const nameClasses = ClassNames('list-group-item', {
        'text-bold': index === currentStepIndex
      });

      // Current step has success label, previous steps are primary
      // future steps are default
      const numberClasses = ClassNames('label', {
        'label-primary': index < currentStepIndex,
        'label-success': index === currentStepIndex
      });

      return (
        <li key={'stepName-' + index} className={nameClasses}>
          <span className={numberClasses}>{index + 1}</span><span className='room-left'> {step.get('text')}</span>
        </li>
      );
    });

    return (
      <div className='megawizard'>
        <div className='row'>
          <div className='col-sm-4'>
            <ul className='list-group'>
              {stepNames}
            </ul>
          </div>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-sm-12 text-center'>
                <h2>{currentStepIndex + 1}. {this.state.currentStep.get('text')}</h2>
              </div>
            </div>
            <div className='row' style={{marginTop: '1em'}}>
              {this.state.currentStep.get('display') && this.state.currentStep.get('display')()}
            </div>
            <Buttons prevButtonText={this.state.currentStep.get('prevButtonText') || this.props.prevButtonText}
              nextButtonText={this.state.currentStep.get('nextButtonText') || this.props.nextButtonText}
              completeButtonText={this.state.currentStep.get('completeButtonText') || this.props.completeButtonText}
              prevStepAllowed={prevStepAllowed}
              nextStepAllowed={nextStepAllowed}
              showCompleteButton={currentStepIndex === this.state.steps.count() -1}
              onPreviousStepClick={this.handlePreviousStepClick}
              onNextStepClick={this.handleNextStepClick}
              onCompleteStepClick={this.handleCompleteStepClick}
              prevButtonClasses={this.state.currentStep.get('prevButtonClasses') || this.props.prevButtonClasses}
              nextButtonClasses={this.state.currentStep.get('nextButtonClasses') || this.props.nextButtonClasses}
              completeButtonClasses={this.state.currentStep.get('completeButtonClasses') || this.props.completeButtonClasses}
            />
          </div>
        </div>
      </div>
    );
  }

  //
  // Custom methods
  //

  handlePreviousStepClick(e: SyntheticInputEvent) {
    e.stopPropagation();
    const currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

    if (currentStepIndex > 0) {
      this.setState({currentStep: this.state.steps.get(currentStepIndex - 1)});
    }
  }

  handleNextStepClick(e: SyntheticInputEvent) {
    e.stopPropagation();
    const currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

    if (currentStepIndex < this.state.steps.count()) {
      this.setState({currentStep: this.state.steps.get(currentStepIndex + 1)});
    }
  }

  handleCompleteStepClick(e: SyntheticInputEvent) {
    e.stopPropagation();
    this.props.onComplete && this.props.onComplete(this.state.currentStep);
  }
}

MegaWizardContainer.defaultProps = {
  completeButtonText: 'Done',
  nextButtonText: 'Next',
  prevButtonText: 'Previous',
};
