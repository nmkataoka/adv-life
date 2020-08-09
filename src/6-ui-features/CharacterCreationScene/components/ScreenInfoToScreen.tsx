import React from 'react';
import SelectionWindow from './SelectionWindow';
import AttributeWindow from './AttributeWindow';
import SliderWindow from './SliderWindow';
import {
  CharacterAttributeGroup,
  CharacterAttributeGroupOneOf,
  CharacterAttributeGroupPointAllocation,
  CharacterAttributeGroupRanges,
} from '../characterCreationSlice';
import { AttributeRowProps } from './AttributeRow';
import { SliderRowProps } from './SliderRow';

type ScreenInfoToScreenProps = {
  screenInfo: CharacterAttributeGroup;
}

const ScreenInfoToScreen = ({ screenInfo }: ScreenInfoToScreenProps): JSX.Element | null => {
  const { name: header, selectType } = screenInfo;
  switch (selectType) {
    case 'oneOf': {
      const { options } = screenInfo as CharacterAttributeGroupOneOf;
      return <SelectionWindow header={header} options={options} />;
    }
    case 'pointAllocation': {
      const { options } = screenInfo as CharacterAttributeGroupPointAllocation;
      const optionProps: AttributeRowProps[] = options.map((o) => ({
        ...o,
        onDecrease: () => undefined,
        onIncrease: () => undefined,
      }));
      return <AttributeWindow header={header} attributes={optionProps} />;
    }
    case 'ranges': {
      const { options } = screenInfo as CharacterAttributeGroupRanges;
      const sliders: SliderRowProps[] = options.map((o) => ({
        ...o,
        onChange: () => undefined,
      }));
      return <SliderWindow header={header} sliders={sliders} />;
    }
    default:
      return null;
  }
};

export default ScreenInfoToScreen;
