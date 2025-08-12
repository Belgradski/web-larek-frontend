import { Component } from "./base/component";
import { ICard } from "../types";
import { ensureElement } from "../utils/utils";

interface ICardAction {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    btn?: HTMLButtonElement;

    protected _color: Record<string, string>= {
        'софт-скил': 'soft',
        'другое': 'other',
        'дополнительное': 'additional',
        'кнопка': 'button',
        'хард-скил': 'hard',
    }

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardAction) {
        super(container)
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        this.btn = container.querySelector(`.${blockName}__button`)

        if (actions?.onClick) {
            if (this.btn) {
                this.btn.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id():string {
        return this.container.dataset.id;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }
    get title():string {
        return this._title.textContent;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.className = `card__category card__category_${this._color[value] || 'default'}`;
    }

    get category():string {
        return this._category.textContent || '';
    }

    set price(value: number |null) {
        this.setText(this._price, value ? `${value.toString()} синапсов` : `бесценно`)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set button(value: string) {
        this.setText(this.btn, value)
    }

    isItemInBasket() {
        this.btn.disabled = true;
        this.setText(this.btn, 'Добавлен в корзину')
    }

    isItemPriceNull() {
        this.btn.disabled = true;
        this.setText(this.btn, 'Недоступно')
    }  
    
}