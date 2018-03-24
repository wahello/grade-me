import React from 'react';
import {configure, addDecorator} from '@storybook/react';

function loadStories() {
    const req = require.context('../src', true, /\.stories.tsx$/);
    const keys = req.keys();
    keys.forEach(req);
}

const styles = {
    'padding': '20px'
};

addDecorator(story => (
    <div style={styles}>
        {story()}
    </div>
));

configure(loadStories, module);