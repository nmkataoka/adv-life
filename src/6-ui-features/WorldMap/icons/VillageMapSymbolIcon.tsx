import { BaseIcon, BaseIconProps } from '6-ui-features/DesignSystem/icons';

export function VillageMapSymbolIcon(props: BaseIconProps): JSX.Element {
  return (
    <BaseIcon {...props}>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
    </BaseIcon>
  );
}
