import React from 'react';
import * as appServices from './services';
import { ServiceList, IServices } from './types';

function withService(...services: ServiceList) {
  const localServices = services.reduce((srvs, srvName) => {
    srvs[srvName] = appServices[srvName];
    return srvs;
  }, ({} as unknown) as Partial<IServices>);
  return function<T, V>(
    Component: React.ComponentType<T>
  ): React.ComponentType<V> {
    return (incomingProps: React.PropsWithChildren<V>) => {
      const props = ({
        ...incomingProps,
        ...localServices,
      } as unknown) as V & T;
      return <Component {...props} />;
    };
  };
}

export default withService;
