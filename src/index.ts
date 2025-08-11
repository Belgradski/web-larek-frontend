import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { StateApp } from './components/StateApp';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICard, IContactForm, IDeliveryForm } from './types';
import { Modal } from './components/common/Modal';
import { Basket, CardInBasket } from './components/Basket';
import { DeliveryForm } from './components/DeliveryForm';
import { ContactForm } from './components/ContactForm';


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contacstemplate = ensureElement<HTMLTemplateElement>('#contacts')

const evt = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const stateData = new StateApp({}, evt);
const page = new Page(document.body, evt);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), evt);
const basket = new Basket('basket', cloneTemplate(basketTemplate), evt);
const delivery = new DeliveryForm(cloneTemplate(orderTemplate), evt);
const contact = new ContactForm(cloneTemplate(contacstemplate), evt)


//загрузка карточек

api.getCards()
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

evt.on('card:select', (item:ICard) => {
    stateData.setCardPreview(item);
    const card = new Card('card', cloneTemplate(cardTemplate), {
        onClick: () => evt.emit('card:add', item)
    })
    
    modal.render({
        content:card.render({
            id:item.id,
            title: item.title,
            image: item.image,
            description: item.description,
            selected: item.selected,
            category: item.category,
            price: item.price,
        })
    })
})

evt.on('modal:open', () => {
    page.scroll = true
})

evt.on('modal:close', () => {
    page.scroll = false
})

evt.on('card:add', (item: ICard) => {
    item.selected = true;
    stateData.addBasket(item);
    page.counter = stateData.getCountCardBasket();
    modal.close();
})

evt.on('basket:open', () => {
    basket.total = stateData.getTotalBasketPrice();
    basket.items = stateData.basket.map((item, index) => {
        const card = new CardInBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => evt.emit('card:delete', item)
        })
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        })
    })
    modal.render({
        content: basket.render()
    })
})

evt.on('card:delete', (item:ICard) => {
    item.selected = false;
    stateData.removeFromBasket(item);
    page.counter = stateData.getCountCardBasket();
    basket.total = stateData.getTotalBasketPrice();
    basket.items = stateData.basket.map((item, index) => {
        const card = new CardInBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => evt.emit('card:delete', item)
        })
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        })
    })
    modal.render({
        content: basket.render()
    })

})
evt.on('basket:order', () => {
    modal.render({
        content: delivery.render({
            address: '',
            payment: '',
            valid: false,
            errors: []
        })
    })
})

evt.on('order:submit', () => {
    stateData.order.total = stateData.getTotalBasketPrice();
    stateData.selected();
    modal.render({
        content: contact.render({
            email: '',
            phone: '',
            valid: false,
            errors: []

        })
    })
})

evt.on('orderErr:change', (errors: Partial<IDeliveryForm>) => {
    const {payment, address} = errors
    delivery.valid = !payment && !address
    delivery.errors = Object.values({payment, address}).filter((i) => !!i).join(';')
})

evt.on('contactErr:change', (errors: Partial<IContactForm>) => {
    const {email, phone} = errors
    contact.valid = !email && !phone
    contact.errors = Object.values({email, phone}).filter((i) => !!i).join(';')
})

evt.on('orderInput:change', (data:{field:keyof IDeliveryForm; value:string}) => {
    stateData.setOrderInput(data.field, data.value)
})