"use client";
import React, { useReducer, useEffect } from "react";
import { type ClientConfig } from "@/lib/agentforce/APIClient";

const _linkedStorage = (() => { 
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  } else if (typeof sessionStorage !== 'undefined') {
    return sessionStorage;
  }
  return null;
})(); 



const clientConfigReducer = (clientConfig:ClientConfig, newClientConfig:ClientConfig) => {
  if (newClientConfig === null && _linkedStorage) {
    localStorage.removeItem('clientConfig');
    return initialState;
  }
  return { ...clientConfig, ...newClientConfig };
};

const isClientConfigSetReducer = (isClientConfigSet:boolean, newIsClientConfigSet:boolean) => {
  if (newIsClientConfigSet === null && _linkedStorage) {
    localStorage.removeItem('isClientConfigSet');
    return false;
  }
  return newIsClientConfigSet;
};

const initialState: ClientConfig = {
    domain: "",
    authUrl: "/services/oauth2/token",
    apiBaseUrl: "https://api.salesforce.com",
    agentId: "",
    clientId: "",
    clientSecret: "",
    corsProxyUrl: 'https://still-fortress-67949-46653f3cc4a1.herokuapp.com',
    product: ''
};

const clientConfigLocalState = () => {
  if(_linkedStorage){
    const state = _linkedStorage.getItem('clientConfig');
    try{
      if(state)
        return JSON.parse(state);
    }catch(e){
      console.error(e);
    }
  }
  return null;
}

const isClientConfigSetLocalState = () => {
  if(_linkedStorage){
    const state = _linkedStorage.getItem('isClientConfigSet');
    try{
      if(state)
        return state === 'true';
    }catch(e){
      console.error(e);
    }
  }
  return false;
}

export interface ClientConfigContextItf { 
  clientConfig: ClientConfig; 
  setClientConfig: React.ActionDispatch<[newClientConfig: ClientConfig]>;
  isClientConfigSet: boolean;
  setIsClientConfigSet: React.ActionDispatch<[newIsClientConfigSet: boolean]>;
}

const ClientConfigContext = React.createContext<ClientConfigContextItf | null >(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ClientConfigProvider(props: { children: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) {
  const [clientConfig, setClientConfig] = useReducer(clientConfigReducer, clientConfigLocalState() || initialState);
  const [isClientConfigSet, setIsClientConfigSet] = useReducer(isClientConfigSetReducer, isClientConfigSetLocalState() || false);

  useEffect(() => {
    if(_linkedStorage){
      localStorage.setItem('clientConfig', JSON.stringify(clientConfig));
      //localStorage.setItem('isClientConfigSet', JSON.stringify(isClientConfigSet));
    }

  }, [clientConfig, isClientConfigSet]);

  return (
    <ClientConfigContext.Provider value={{ clientConfig, setClientConfig, isClientConfigSet, setIsClientConfigSet }}>
      {props.children}
    </ClientConfigContext.Provider>
  );
}

export { ClientConfigContext, ClientConfigProvider };