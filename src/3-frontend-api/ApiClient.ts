import { EntityManager } from '0-engine';
import { GameManager } from '0-engine/GameManager';
import { Selector } from '4-react-ecsal';
import { DeepReadonly } from 'ts-essentials';

type Headers = {
  userId: number;
};

class ApiClient {
  public emit: EntityManager['dispatch'] = (...args) => GameManager.instance.eMgr.dispatch(...args);

  public get<T>(selector: Selector<T>): DeepReadonly<T> {
    return selector(GameManager.instance.eMgr);
  }

  public setHeader = <Key extends keyof Headers>(header: Key, value: Headers[Key]) => {
    this.headers[header] = value;
  };

  // Common config info often tacked onto thunks
  public headers: { userId: number } = { userId: -1 };
}

/** Global reference to backend, no difference from using react-ecsal `useDispatch` and `useSelector` */
const apiClient = new ApiClient();
export default apiClient;
