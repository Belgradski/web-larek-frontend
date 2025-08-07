import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { StateApp } from './components/StateApp';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { ensureElement, cloneTemplate } from './utils/utils';


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');


const evt = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const stateData = new StateApp({}, evt);
const page = new Page(document.body, evt)





api.getCards()
    .then(data => stateData.setCatalog(data))
    .catch((error: string) => {
        console.error(error);
    });
    
evt.on('items:changed', () => {
    page.catalog = stateData.catalog.map((item) => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate));
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        })
    })
})