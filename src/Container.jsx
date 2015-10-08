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

    // Hide the next button on the last step
    let nextButtonClasses = ClassNames('btn','btn-success','pull-right', {
      'hidden': currentStepIndex === this.state.steps.count() - 1,
    });

    // Hide the complete button unless we are on the last step
    let completeButtonClasses = ClassNames('btn','btn-danger','pull-right', {
      'hidden': currentStepIndex < this.state.steps.count() - 1,
    });

    // If defined, execute a validator and check the result to determine if the step can advance
    let mayAdvance = typeof this.state.currentStep.get('validator') === 'undefined' || this.state.currentStep.get('validator');

    let buttons = (<div className='row' style={{marginTop: '2em'}}>
      <div className='col-sm-12'>
        <button className='btn btn-white' disabled={currentStepIndex === 0} onClick={this.handlePreviousStepClick} >
          <i className='fa fa-arrow-left'></i> Previous
        </button>
        <button className={nextButtonClasses} onClick={this.handleNextStepClick} disabled={!mayAdvance} >
          <i className='fa fa-arrow-right'></i> Next
        </button>
        <button className={completeButtonClasses} onClick={this.props.onComplete} disabled={!mayAdvance}>
          Yes, I'm Sure
        </button>
      </div>
    </div>);

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
      <div id='megawizard'>
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
            {buttons}
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
  // Wizard steps
  steps: React.PropTypes.instanceOf(Immutable.List).isRequired,
  // Optional
  // onComplete: called when the final wizard complete button is clicked
  onComplete: React.PropTypes.func,
  // onStepChanged: called when any step changes, passes step index
  onStepChanged: React.PropTypes.func,
};
