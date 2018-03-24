import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {ProjectDialog} from './ProjectDialog';

class DialogContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
    }

    public render() {
        return (
            <ProjectDialog
                name={this.state.name}
                description={this.state.description}
                onNameChange={this.onNameChanged}
                onDescriptionChange={this.onDescriptionChanged}
                open={true}
                onClose={() => {
                    console.log('Dialog closes.');
                }}
                onSave={() => {
                    console.log('Dialog saves.');
                }}
            />
        );
    }

    private onNameChanged = (name: string) => {
        this.setState({name});
    }

    private onDescriptionChanged = (description: string) => {
        this.setState({description});
    }
}

storiesOf('ProjectDialog', module)
    .add('when creating new project', () => {
        return (
            <DialogContainer/>
        );
    });
