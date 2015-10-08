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

Contrived Example:

    render() {
      let stepDef = Immutable.fromJS([
        {
          name: 'enterName',
          text: `Enter a name for widget ${this.state.widgetId}`,
          onEnter: this.props.hideWidgetList,
          validator: this.state.nameInputText,
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
          validator: this.state.descriptionText,
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

## Todo
- Remove or make Bootstrap styling optional
- Allow for replaceable/configurable sidebar
