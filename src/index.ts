import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { StateApp } from './components/StateApp';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Page } from './components/Page';





const evt = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const stateData = new StateApp({}, evt);
const page = new Page(document.body, evt)