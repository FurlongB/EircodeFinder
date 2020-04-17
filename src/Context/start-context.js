import React from 'react';

const startContext = React.createContext({startLocation: {}, startStatus: (data) => {}});

export default startContext;