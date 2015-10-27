# MegaWizard

## React Wizard Component

MegaWizard is a React component for easily making step-by-step wizards without having to configure ten thousand seperate props..

### Features
- Super flexibile configuration via a step definition object.
  - Easily embed React components or HTML elements.
  - Optional step validators to prevent advancement until your conditions are met.
  - Optional visibility flag for dynamically hiding/display steps.
  - Execution hooks for entering and leaving steps
- Step display summary and completed step indications.
- Super fast rendering that works on both client and server.
- Only renders markup for currently displayed steps.
- Best name ever for a wizard.

### Limitations
- Relies on Bootstrap for styling and layout
- No way to customize step summary

If you are interested in helping with any of this, I would gladly take pull requests.

## Using it
To use MegaWizard:
- Install the component through NPM
- Require it
- Create step definition object and pass it to MegaWizard

### Component props
MegaWizard has the following component props:

#### Required:
**steps** - step definition object

#### Optional
**onStepChanged(currentStep)** - function to call after a step is changed. Argument is the current step. Called before onEnter and onExit hooks.

**onComplete()** - function to call when complete button is clicked on last step. No arguments. Called before onExit hook.

**prevButtonText** - global text override to display for previous button. Default is "Previous".

**nextButtonText** - global text override to display for next button. Default is "Next".

**completeButtonText** - global text override to display for complete button. Default is "Done".

**prevButtonClasses** - global class override for previous button. If using, you must handle horizontal positioning yourself.

**nextButtonClasses** - global class override for next button. If using, you must handle horizontal positioning yourself.

**completeButtonClasses** - global class override for complete button. If using, you must handle horizontal positioning yourself.


### Step definition options

Steps definitions are a flexible way to get some fairly complex behaviors into the wizard. Since each step is defined indepentently, you can drive wizard behavior by using state/props from outisde the wizard. Step definitions may have any combination of the following options:

#### Required:
**name** - unique indentifier for step

**text** - display name (shown on sidebar and header)

#### Optional
**onEnter** - function to call when entering this step (fires when entering steps via next or previous movement). No arguments.

**onExit** - function to call when exiting this step (fires when leaving steps via next or previous movement). No arguments.

**visible** - entire step is hidden if this is **defined** and **false**. May truthy, falsy, or bool.

**nextValidator** - next button is disabled if this is **defined** and **false**. May truthy, falsy, or bool.

**prevValidator** - previous button is disabled if this is **defined** and **false**. May truthy, falsy, or bool.

**prevButtonText** - text to display for previous button. Default is "Previous".

**nextButtonText** - text to display for next button. Default is "Next".

**completeButtonText** - text to display for complete button. Default is "Done".

**prevButtonClasses** - class overrides for previous button. If using, you must handle horizontal positioning yourself.

**nextButtonClasses** - class overrides for next button. If using, you must handle horizontal positioning yourself.

**completeButtonClasses** - class overrides for complete button. If using, you must handle horizontal positioning yourself.

**display** - React element to display when step is active.

### Contrived Example:

    render() {
      let stepDef = Immutable.fromJS([
        {
          name: 'enterName',
          text: `Enter a name for widget ${this.state.widgetId}`,
          onEnter: this.props.hideWidgetList,
          nextValidator: this.state.nameInputText,
          display: () => {
            return (
              <div>
                <input type='text' value={this.state.nameText} onChange={this.handleInputChange} />
              </div>
            );
          },
        },
        {
          name: 'enterDescription',
          text: 'Enter a description',
          visible: this.state.descriptionRequired,
          nextValidator: this.state.descriptionText,
          display: () => {
            return (
              <DescriptionForm description={this.state.descriptionText}
                onChange={this.handleDescriptionChange} />
            );
          }
        },
        {
          name: 'confirm',
          text: 'Confirm',
          onExit: this.showWidgetList,
          display: () => {
            return (
              <div>
                Are you sure you want to use <strong>{this.state.nameText} - {this.state.descriptionText}</strong> for your widget?
              </div>
            );
          },
        },
      ]);

      return (
        <MegaWizard steps={stepDef} onStepChanged={this.handleStepChanged} onComplete={this.handleWizardComplete} />
      );
    }


## Contributing

First, setup your local environment:

    git clone git@github.com:ZeroarcSoftware/megawizard.git
    cd megawizard
    npm install

Next, build the project (for use in a npm link scenario):

    npm run build

To watch for changes:

    npm run watch

## Issues
Issues are tracked in [Github Issues](https://github.com/ZeroarcSoftware/megawizard/issues).

## Changes
Changes are tracked as [Github Releases](https://github.com/ZeroarcSoftware/megawizard/releases).
