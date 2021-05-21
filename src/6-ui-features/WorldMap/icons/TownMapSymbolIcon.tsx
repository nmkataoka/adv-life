import { BaseIcon, BaseIconProps } from '6-ui-features/DesignSystem/icons';

interface TownMapSymbolIconProps extends BaseIconProps {
  backgroundColor: string;
}

export function TownMapSymbolIcon({
  backgroundColor,
  ...props
}: TownMapSymbolIconProps): JSX.Element {
  return (
    <BaseIcon {...props}>
      <circle cx="8" cy="8" r="4" fill="currentColor" />
      <circle cx="8" cy="8" r="3" fill={backgroundColor} />
    </BaseIcon>
  );
}
