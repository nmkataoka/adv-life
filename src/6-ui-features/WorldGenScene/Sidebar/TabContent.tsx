import React from 'react';
import { SettingsHeading } from './SettingsHeading';
import { SliderOptions, SliderOptionsProps } from './SliderOptions';
import { ButtonRow } from './ButtonRow';

export type TabContentProps = {
  content: { heading: string; options: SliderOptionsProps['options'] }[];
  onChange: (heading: string) => SliderOptionsProps['onChange'];
};

export function TabContent({ content, onChange }: TabContentProps): JSX.Element {
  return (
    <>
      {content.map(({ heading, options }) => (
        <>
          <SettingsHeading>{heading}</SettingsHeading>
          <SliderOptions options={options} onChange={onChange(heading)} />
        </>
      ))}
      <ButtonRow />
    </>
  );
}
