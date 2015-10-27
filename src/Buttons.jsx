/* MegaWizard - Copyright 2015 Zeroarc Software, LLC
 *
 * Navigation buttons
 *
 */

'use strict';

// External
let React = require('react');
let ClassNames = require('classnames');

let Buttons = (props) => {
  let prevButtonClasses = props.prevButtonClasses || 'btn btn-white';

  let nextButtonClasses = props.nextButtonClasses || 'btn btn-success pull-right';

  // Hide the next button on the last step
  if (props.showCompleteButton) nextButtonClasses += ' hidden';

  let completeButtonClasses = props.completeButtonClasses || 'btn btn-danger pull-right';

  // Hide the complete button unless we are on the last step
  if (!props.showCompleteButton) completeButtonClasses += ' hidden';

  return (<div className='row' style={{marginTop: '2em'}}>
    <div className='col-sm-12'>
      <button className={prevButtonClasses} disabled={!props.prevStepAllowed} onClick={props.onPreviousStepClick}>
        <i className='fa fa-arrow-left'></i> {props.prevButtonText}
      </button>
      <button className={nextButtonClasses} disabled={!props.nextStepAllowed} onClick={props.onNextStepClick}>
        <i className='fa fa-arrow-right'></i> {props.nextButtonText}
      </button>
      <button className={completeButtonClasses} disabled={!props.nextStepAllowed} onClick={props.onCompleteStepClick}>
        <i className='fa fa-check'></i> {props.completeButtonText}
      </button>
    </div>
  </div>)
};

Buttons.propTypes = {
  // Required
  prevButtonText: React.PropTypes.string.isRequired,
  nextButtonText: React.PropTypes.string.isRequired,
  completeButtonText: React.PropTypes.string.isRequired,
  prevStepAllowed: React.PropTypes.bool.isRequired,
  nextStepAllowed: React.PropTypes.bool.isRequired,
  showCompleteButton: React.PropTypes.bool.isRequired,
  onPreviousStepClick: React.PropTypes.func.isRequired,
  onNextStepClick: React.PropTypes.func.isRequired,
  onCompleteStepClick: React.PropTypes.func.isRequired,
  // Optional
  prevButtonClasses: React.PropTypes.string,
  nextButtonClasses: React.PropTypes.string,
  completeButtonClasses: React.PropTypes.string,
};

export default Buttons;
