import { BaseIcon, BaseIconProps } from '6-ui-features/DesignSystem/icons';

interface CityMapSymbolIconProps extends BaseIconProps {
  backgroundColor: string;
}

export function CityMapSymbolIcon({
  backgroundColor,
  ...props
}: CityMapSymbolIconProps): JSX.Element {
  return (
    <BaseIcon {...props}>
      <circle cx="8" cy="8" r="5" fill="currentColor" />
      <circle cx="8" cy="8" r="4" fill={backgroundColor} />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </BaseIcon>
  );
}
