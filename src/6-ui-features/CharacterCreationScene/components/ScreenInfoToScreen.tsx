import React from 'react';
import SelectionWindow from '../CharacterAttributeGroup/OneOf/SelectionWindow';
import AttributeWindow from '../CharacterAttributeGroup/PointAllocation/AttributeWindow';
import SliderWindow from '../CharacterAttributeGroup/Ranges/SliderWindow';
import CharacterAttributeGroup, {
  OneOf, PointAllocation, Ranges, Freeform,
} from '../CharacterAttributeGroup';
import FreeformInputWindow from '../CharacterAttributeGroup/Freeform/FreeformInputWindow';

type ScreenInfoToScreenProps = {
  screenInfo: CharacterAttributeGroup;
}

const ScreenInfoToScreen = ({ screenInfo }: ScreenInfoToScreenProps): JSX.Element => {
  const { name: header, selectType } = screenInfo;
  switch (selectType) {
    case 'freeform': {
      const { options } = screenInfo as Freeform;
      return <FreeformInputWindow header={header} options={options} />;
    }
    case 'oneOf': {
      const { options, selectedIdx } = screenInfo as OneOf;
      return <SelectionWindow header={header} options={options} selectedIdx={selectedIdx} />;
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
      return <h2>Error: unrecognized screen info type</h2>;
  }
};

export default ScreenInfoToScreen;
