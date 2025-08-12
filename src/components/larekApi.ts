import { Api, ApiListResponse} from './base/api';
import { ICard, IOrder, ISuccessFulOrder } from '../types';
import { IOrderApi } from '../types';

interface ILarekApi {
    getCardsId: (id: string) => Promise<ICard>;
    getOrder: (order: IOrder) => Promise<ISuccessFulOrder>;
    getCards: () => Promise<ICard[]>
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardsId(id: string): Promise<ICard>{
        return this.get(`/product/${id}`).then((item:ICard) => ({...item, image:this.cdn + item.image,}))
    } 

    getCards(): Promise<ICard[]>{
        return this.get(`/product`).then((data: ApiListResponse<ICard>) => data.items.map((item) => ({...item, image:this.cdn + item.image,})) );
    }

    getOrder(order: IOrderApi): Promise<ISuccessFulOrder>{
        return this.post(`/order`, order).then((res: ISuccessFulOrder) => ({
            id: res.id,
            total: res.total
        }));
    }
}
