import { combineReducers } from 'redux';
import { AuthReducer } from './AuthReducer';
import { BanksReducer } from './BanksReducer';
import { GeneralReducer } from './General';
import { JobsReducer } from './JobsReducer';
import { ListedCompaniesReducer } from './ListedCompaniesReducer';
import { MarketPlaceReducer } from './MarketPlaceReducer';
import { NetworkReducer } from './NetworkReducer';
import { NewsReducer } from './NewsReducer';
import { NotificationReducer } from './NotificationReducer';
import { PostReducer } from './PostReducer';
import { SeminarsReducer } from './SeminarsReducer';
import { ServicesReducer } from './ServicesReducer';
import { ChatReducer } from './ChatReducer';
import PaymentReducer from './PaymentReducer';
import {AppReducer} from './AppReducer';




export const reducer = combineReducers({ AppReducer, PaymentReducer, AuthReducer, GeneralReducer, ServicesReducer, BanksReducer, NewsReducer, SeminarsReducer, ListedCompaniesReducer, MarketPlaceReducer, PostReducer, JobsReducer, NetworkReducer, NotificationReducer, ChatReducer });

