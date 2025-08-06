import { IStateApp, ICard, IOrder, messageError} from "../types";
import { Model } from "./base/model";

interface IValid{
    email: string;
    phone: string;
    address: string;
    payment: string;

}

export class StateApp extends Model<IStateApp> {
    catalog: ICard[];
    order: IOrder = this.getOrder();
    basket: ICard[] = [];
    preview: string | null;
    messageError: messageError = {};


    setCatalog(items: ICard[]) {
        this.catalog = items;
        this.emitChanges('items:changed')
    };

    addBasket(item: ICard) {
        this.basket.push(item)
    };

    removeFromBasket(items: ICard) {
        this.basket = this.basket.filter((item) => item.id !== items.id)
    };

    getTotalBasketPrice() {
        let total = 0;
        this.basket.forEach((items) => {
            total = total + items.price;
        })
        return total;
    };
    
    setCardPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item)
    };

    getCountCardBasket() {
        return this.basket.length;
    };

    getOrder(): IOrder {
        return {
            payment: '',
            address: '',
            phone: '',
            email: '',
            items: [],
            total: 0,
        }
    };

    selected():void {
        this.order.items = this.basket.map((items) => items.id)
    };

    clearBasket():void {
        this.basket = [];
    };

    clearOrder():void {
        this.order = this.getOrder();
    };

    resetSelected():void {
        this.catalog.forEach((items) => items.selected = false);
    };

    validateOrder():boolean {
        const errors: typeof this.messageError = {};

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }

        this.messageError = errors;

        this.evt.emit('orderErr:change', this.messageError);
        return Object.keys(errors).length === 0;
    };

    validateContact():boolean {
        const errors: typeof this.messageError = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать Email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.messageError = errors;
        this.events.emit('contactErr:change', this.messageError)
        return Object.keys(errors).length === 0;
    };

    setOrderInput(field: keyof IValid, value: string) {
        this.order[field] = value;
        if (!this.validateOrder()) {
            return
        } 
        if (!this.validateContact()) {
            return
        }
    };



}