import React from 'react';
import { SettingsHeading } from './SettingsHeading';
import { SliderOptions, SliderOptionsProps } from './SliderOptions';
import { ButtonRow } from './ButtonRow';

export type TabContentProps = {
  content: { heading: string; options: SliderOptionsProps['options'] }[];
  onChange: (heading: string) => SliderOptionsProps['onChange'];
  onGo: () => void;
};

export function TabContent({ content, onChange, onGo }: TabContentProps): JSX.Element {
  return (
    <>
      {content.map(({ heading, options }) => (
        <React.Fragment key={heading}>
          <SettingsHeading>{heading}</SettingsHeading>
          <SliderOptions options={options} onChange={onChange(heading)} />
        </React.Fragment>
      ))}
      <ButtonRow onGo={onGo} />
    </>
  );
}
