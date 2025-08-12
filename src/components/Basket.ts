import { Component } from "./base/component";
import { ICard } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IBasket {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    button: HTMLButtonElement;

    constructor(blockName: string, container: HTMLElement, protected event: IEvents) {
        super(container)

        this._list = ensureElement<HTMLElement>(`.${blockName}__list`, this.container);
        this._price = this.container.querySelector(`.${blockName}__price`)
        this.button = this.container.querySelector(`.${blockName}__button`)

        if(this.button) {
            this.button.addEventListener('click', () => {
                event.emit('basket:order')
            })
        }

        this.items = [];
    }

    set total(price:number) {
        this.setText(this._price, price + 'Синапсов')
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items)
        this.button.disabled = items.length ? false : true
    }

    disableBtn() {
        this.button.disabled = true;
    }


}

interface ICardsInBasket extends ICard {
    index: number;
}

interface doing {
    onClick: (event: MouseEvent) => void;
}

export class CardInBasket extends Component<ICardsInBasket> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    
    constructor(blockName: string, container: HTMLElement, events: IEvents, action?: doing) {
        super(container)

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`)

        if(this._button) {
            this._button.addEventListener('click', (evt) => {
               if (action) {
                action.onClick(evt)
               } else {
                events.emit('card:delete')
               }  
            })
        }
    }

    set index(value:number) {
        this._index.textContent = value.toString();
    }

    set price(value:number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно')
        } else {
            this.setText(this._price, value + 'Синапсов')
        }
    }

    set title(value:string) {
        this.setText(this._title, value)
    }
}
