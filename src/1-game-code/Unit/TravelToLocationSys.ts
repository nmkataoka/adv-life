import { createEventSlice } from '0-engine';
import { UnitLocationCmpt } from './UnitLocationCmpt';

const travelToTownSlice = createEventSlice('travelToTown', {
  writeCmpts: [UnitLocationCmpt],
})<{ entityId: number; townId: number }>(function travelToTown({
  componentManagers: {
    writeCMgrs: [unitLocationMgr],
  },
  payload: { entityId, townId },
}) {
  const unitLocationCmpt = unitLocationMgr.getMut(entityId);
  unitLocationCmpt.townId = townId;
});

export const { travelToTown } = travelToTownSlice;

export default [travelToTownSlice.eventListener];
