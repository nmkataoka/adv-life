import { EntityManager } from '0-engine';
import { GameManager } from '0-engine/GameManager';

class ApiClient {
  public emit: EntityManager['dispatch'] = (...args) => GameManager.instance.eMgr.dispatch(...args);
}

/** Global reference to backend, no difference from using react-ecsal `useDispatch` */
const apiClient = new ApiClient();
export default apiClient;
