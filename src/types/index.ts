export interface IStateApp{
    catalog: ICard[]; // каталог товаров
    order: IOrder|null; //заказ
    basket: ICard[]; //корзина
    setCatalog(items: ICard[]): void; // устанавливает каталог карточек
    addBasket(item: ICard): void // добавляет в корзину 
    getTotalBasketPrice(): number // выводит общую стоимость товаров в корзине
}

export interface ICard{
    id: string; // идентификатор товара
    title: string; // название товара
    image: string; // ссылка на картинку товара
    description: string; // описание товара
    selected: boolean; // показывает добавлен ли товар в корзину
    category: string; //категория товара
    price: number|null; // цена
}

export interface IOrder{
    payment: string;  // способ оплаты
    address: string; // адрес доставки
    phone: string; // телефонный номер покупателя
    email: string; // электронная почта покупателя
    items: string[];
    total: number;
 }

export interface IPage{
    counter: number; // количество товаров в корзине
    catalog: HTMLElement[]; //  массив карточек товаров
}

export interface IDeliveryForm{
    payment: string; // способ оплаты 
    address: string; // адрес доставки
}

export interface IContactForm{
    email: string; // электронная почта покупателя
    phone: string; // номер телефона покупателя
}

export interface ISuccessFulOrder {
    id: string;
    total: number;
}

export type messageError = Partial<Record<keyof IOrder, string>>;

export interface IModal {
    content: HTMLElement;
}

