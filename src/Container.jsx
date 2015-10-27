/* MegaWizard - Copyright 2015 Zeroarc Software, LLC
 *
 * Top level container component
 */

'use strict';

// External
let React = require('react');
let ReactShallowCompare = require('react-addons-shallow-compare');
let Immutable = require('immutable');
let ClassNames = require('classnames');
let Autobind = require('autobind-decorator');

// Local
let Buttons = require('./Buttons');


@Autobind
export default class MegaWizardContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    let visibleSteps = props.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

    this.state = {
      currentStep: visibleSteps.get(0),
      steps: visibleSteps,
    };
  }

  // Because we have steps in state, we need watch for updates
  // and re-filter
  componentWillReceiveProps(nextProps) {
    if (nextProps.steps !== this.props.steps) {
      let currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

      let visibleSteps = nextProps.steps.filter(s => typeof s.get('visible') === 'undefined' || s.get('visible'));

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

  // Check for step changes and fire optional callbacks
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentStep.get('name') !== this.state.currentStep.get('name')) {
      // Fire global step change callback if it exists
      this.props.onStepChanged && this.props.onStepChanged(this.state.currentStep);

      // Fire entry/exit steps if they exist for previous and current states
      prevState.currentStep.get('onExit') && prevState.currentStep.get('onExit')();
      this.state.currentStep.get('onEnter') && this.state.currentStep.get('onEnter')();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ReactShallowCompare(this, nextProps, nextState);
  }

  render() {
    let currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

    // If defined, execute validators and check the result to determine if the step can advancex;
    let nextStepAllowed = typeof this.state.currentStep.get('nextValidator') === 'undefined' || !!this.state.currentStep.get('nextValidator');
    // In addition to the prevValidator, make sure this isn't the first step
    let prevStepAllowed = currentStepIndex !== 0 &&
      (typeof this.state.currentStep.get('prevValidator') === 'undefined' || !!this.state.currentStep.get('prevValidator'));

    // Build out summary column of steps
    let stepNames = this.state.steps.map((step,index) => {
      // Current step is highlighted in bold
      let nameClasses = ClassNames('list-group-item', {
        'text-bold': index === currentStepIndex
      });

      // Current step has success label, previous steps are primary
      // future steps are default
      let numberClasses = ClassNames('label', {
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
              onCompleteStepClick={this.props.onComplete}
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

  handlePreviousStepClick(e) {
    e.stopPropagation();
    let currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

    if (currentStepIndex > 0) {
      this.setState({currentStep: this.state.steps.get(currentStepIndex - 1)});
    }
  }

  handleNextStepClick(e) {
    e.stopPropagation();
    let currentStepIndex = this.state.steps.findIndex(s => s === this.state.currentStep);

    if (currentStepIndex < this.state.steps.count()) {
      this.setState({currentStep: this.state.steps.get(currentStepIndex + 1)});
    }
  }
}

MegaWizardContainer.propTypes = {
  // Required
  // steps: Wizard steps config object
  steps: React.PropTypes.instanceOf(Immutable.List).isRequired,
 // Optional override for complete button text
  completeButtonText: React.PropTypes.string.isRequired,
  // Optional override for next button text
  nextButtonText: React.PropTypes.string.isRequired,
  // Optional override for previous button text
  prevButtonText: React.PropTypes.string.isRequired,

  // Optional
  // onComplete: called when the final wizard complete button is clicked
  onComplete: React.PropTypes.func,
  // called when any step changes, passes step index
  onStepChanged: React.PropTypes.func,
  // Optional override for previous button classes
  prevButtonClasses: React.PropTypes.string,
  // Optional override for next button classes
  nextButtonClasses: React.PropTypes.string,
  // Optional override for complete button classes
  completeButtonClasses: React.PropTypes.string,
 };

MegaWizardContainer.defaultProps = {
  completeButtonText: 'Done',
  nextButtonText: 'Next',
  prevButtonText: 'Previous',
};
