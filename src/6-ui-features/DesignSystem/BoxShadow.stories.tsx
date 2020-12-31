import React from 'react';
import { Story, Meta } from '@storybook/react';

type BoxShadowProps = {
  shadowNum: number;
};

function BoxShadow({ shadowNum }: BoxShadowProps) {
  return (
    <div
      style={{
        boxShadow: `var(--shadow-${shadowNum})`,
        height: '100px',
        width: '100px',
      }}
    />
  );
}

export default {
  title: 'Example/BoxShadow',
  component: BoxShadow,
} as Meta;

const Template: Story<BoxShadowProps> = (args) => <BoxShadow {...args} />;

export const BoxShadow1 = Template.bind({});
BoxShadow1.args = { shadowNum: 1 };

export const BoxShadow2 = Template.bind({});
BoxShadow2.args = { shadowNum: 2 };

export const BoxShadow3 = Template.bind({});
BoxShadow3.args = { shadowNum: 3 };

export const BoxShadow4 = Template.bind({});
BoxShadow4.args = { shadowNum: 4 };

export const BoxShadow6 = Template.bind({});
BoxShadow6.args = { shadowNum: 6 };

export const BoxShadow8 = Template.bind({});
BoxShadow8.args = { shadowNum: 8 };

export const BoxShadow12 = Template.bind({});
BoxShadow12.args = { shadowNum: 12 };

export const BoxShadow16 = Template.bind({});
BoxShadow16.args = { shadowNum: 16 };

export const BoxShadow20 = Template.bind({});
BoxShadow20.args = { shadowNum: 20 };

export const BoxShadow24 = Template.bind({});
BoxShadow24.args = { shadowNum: 24 };
