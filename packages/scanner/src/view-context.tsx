import React from 'react';

export interface IViewContext {
    currentView: number;
    setCurrentView: (any) => void;
}

// @ts-ignore
const ViewContext = React.createContext<IViewContext>(null);

export { ViewContext };
