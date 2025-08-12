import { Component } from "../base/component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IModal } from "../../types";

export class Modal extends Component<IModal> {
    protected _closeBtn: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this._closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeBtn.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (evt) => evt.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active')
        this.events.emit('modal:open')
    }

    close() {
        this.container.classList.remove('modal_active')
        this.content = null;
        this.events.emit('modal:close')
    }

    render(data: IModal): HTMLElement {
        console.log(data)
        super.render(data)
        this.open()
        return this.container
    }
}