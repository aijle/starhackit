import _ from 'lodash';
import { applyMiddleware, compose, createStore, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import { routerReducer} from 'react-router-redux';
import DevTools from './parts/core/components/DevTools';
import config from './config';

function devTools(){
    return  !window.devToolsExtension && config.development && DevTools.instrument();
}

function logger(){
  return createLogger({});
}

function createReducers(modules) {
    let reducers = _.reduce(modules, (acc, module, key) => {
        if (module.reducers) {
            acc[key] = combineReducers(module.reducers)
        }
        return acc;
    }, {});

    reducers.routing = routerReducer;

    return combineReducers(reducers)
}

function createMiddlewares(modules){
  return _.reduce(modules, (acc, module) => {
    if(module.middlewares){
      acc = acc.concat(module.middlewares)
    }
    return acc
  }, []);
}

export default function configureStore(modules, initialState = {}) {
  const reducers = createReducers(modules);
  const middlewares = createMiddlewares(modules)
  let plugins;
  if (!window.devToolsExtension && config.development){
    plugins = compose(applyMiddleware(thunk, ...middlewares, logger()), devTools());
  }else {
    plugins = applyMiddleware(thunk, ...middlewares, logger());
  }
  const store = createStore(
    reducers,
    initialState,
    plugins
  );

  return store
}
