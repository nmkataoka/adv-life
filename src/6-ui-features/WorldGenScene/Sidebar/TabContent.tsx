import { Fragment } from 'react';
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
        <Fragment key={heading}>
          <SettingsHeading>{heading}</SettingsHeading>
          <SliderOptions options={options} onChange={onChange(heading)} />
        </Fragment>
      ))}
      <ButtonRow onGo={onGo} />
    </>
  );
}
