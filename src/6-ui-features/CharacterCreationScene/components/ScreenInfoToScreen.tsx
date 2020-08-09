import React from 'react';
import SelectionWindow from './SelectionWindow';
import AttributeWindow from './AttributeWindow';
import SliderWindow from './SliderWindow';
import {
  CharacterAttributeGroup,
  CharacterAttributeGroupOneOf,
  CharacterAttributeGroupPointAllocation,
  CharacterAttributeGroupRanges,
} from '../characterCreationTypes';

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
      return <AttributeWindow header={header} attributes={options} />;
    }
    case 'ranges': {
      const { options } = screenInfo as CharacterAttributeGroupRanges;
      return <SliderWindow header={header} sliders={options} />;
    }
    default:
      return null;
  }
};

export default ScreenInfoToScreen;
