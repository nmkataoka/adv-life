import React from 'react';
import SelectionWindow from '../CharacterAttributeGroup/OneOf/SelectionWindow';
import AttributeWindow from '../CharacterAttributeGroup/PointAllocation/AttributeWindow';
import SliderWindow from '../CharacterAttributeGroup/Ranges/SliderWindow';
import CharacterAttributeGroup, { OneOf, PointAllocation, Ranges } from '../CharacterAttributeGroup';

type ScreenInfoToScreenProps = {
  screenInfo: CharacterAttributeGroup;
}

const ScreenInfoToScreen = ({ screenInfo }: ScreenInfoToScreenProps): JSX.Element | null => {
  const { name: header, selectType } = screenInfo;
  switch (selectType) {
    case 'oneOf': {
      const { options } = screenInfo as OneOf;
      return <SelectionWindow header={header} options={options} />;
    }
    case 'pointAllocation': {
      const { options } = screenInfo as PointAllocation;
      return <AttributeWindow header={header} attributes={options} />;
    }
    case 'ranges': {
      const { options } = screenInfo as Ranges;
      return <SliderWindow header={header} sliders={options} />;
    }
    default:
      return null;
  }
};

export default ScreenInfoToScreen;
