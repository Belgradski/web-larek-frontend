import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { StateApp } from './components/StateApp';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICard, IContactForm, IDeliveryForm, IOrder } from './types';
import { Modal } from './components/common/Modal';
import { Basket, CardInBasket } from './components/Basket';
import { DeliveryForm } from './components/DeliveryForm';
import { ContactForm } from './components/ContactForm';
import { SuccessOrder } from './components/Success';
import { IOrderApi } from './types';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contacstemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const evt = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const stateData = new StateApp({}, evt);
const page = new Page(document.body, evt);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), evt);
const basket = new Basket('basket', cloneTemplate(basketTemplate), evt);
const delivery = new DeliveryForm(cloneTemplate(orderTemplate), evt);
const contact = new ContactForm(cloneTemplate(contacstemplate), evt);
const successBuy = new SuccessOrder(
	'order-success',
	cloneTemplate(successTemplate),
	{
		onClick:() => modal.close(),
	}
);

//загрузка карточек

api
	.getCards()
	.then((data) => stateData.setCatalog(data))
	.catch((error: string) => {
		console.error(error);
	});

evt.on('items:changed', () => {
	page.catalog = stateData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => evt.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

evt.on('card:select', (item: ICard) => {
	stateData.setCardPreview(item);
    const itemInBasket = stateData.basket.some((basketItem) => basketItem.id === item.id);
	const card = new Card('card', cloneTemplate(cardTemplate), {
		onClick: () => evt.emit('card:add', item),
	})
    if (itemInBasket) card.isItemInBasket();
    if (item.price === null) card.isItemPriceNull();

	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			selected: item.selected,
			category: item.category,
			price: item.price,
		}),
	});
});

evt.on('modal:open', () => {
	page.scroll = true;
});

evt.on('modal:close', () => {
	page.scroll = false;
});

evt.on('card:add', (item: ICard) => {
	item.selected = true;
	stateData.addBasket(item);
	page.counter = stateData.getCountCardBasket();
	modal.close();
});

evt.on('basket:change', () => {
    basket.total = stateData.getTotalBasketPrice();
    page.counter = stateData.getCountCardBasket()
    basket.items = stateData.basket.map((item, index) => {
		const card = new CardInBasket('card', cloneTemplate(cardBasketTemplate), evt, {
            onClick: () => evt.emit('card:delete', item)
		})
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

})

evt.on('basket:open', () => {
	evt.emit('basket:change');
	modal.render({
		content: basket.render(),
	});
});

evt.on('card:delete', (item: ICard) => {
	item.selected = false;
	stateData.removeFromBasket(item);
	
});
evt.on('basket:order', () => {
	modal.render({
		content: delivery.render({
			address: stateData.order.address || '',
			payment: stateData.order.payment || '',
			valid: false,
			errors: [],
		}),
	});
});

evt.on('order:submit', () => {
	modal.render({
		content: contact.render({
			email: stateData.order.email || '',
			phone: stateData.order.phone || '',
			valid: false,
			errors: [],
		}),
	});
});

evt.on('orderErr:change', (errors: Partial<IDeliveryForm>) => {
	const { payment, address } = errors
	delivery.valid = !payment && !address
	delivery.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

evt.on('contactErr:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors
	contact.valid = !email && !phone
	contact.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

evt.on(
	'orderInput:change',
	(data: {field: keyof IDeliveryForm; value: string }) => {
		stateData.setOrderInput(data.field, data.value);
	}
);

evt.on('contacts:submit', () => {
    const completeOrder: IOrderApi = {
        ...stateData.order,
        items: stateData.basket.map(item => item.id),
        total: stateData.getTotalBasketPrice()
    }
	api.getOrder(completeOrder)
    .then((res) => {
		modal.render({
			content: successBuy.render({
				description: res.total,
			}),
		});
        stateData.clearBasket();
        stateData.clearOrder();
        page.counter = 0;  
	})
    .catch(() => console.error());
});
