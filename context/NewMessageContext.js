import React, { createContext, useState } from 'react';

export const NewMessagesContext = createContext();

const NewMessagesContextProvider = props => {
  const [newMessage, setNewMessage] = useState(false)

  return (
    <NewMessagesContext.Provider value={{ newMessage, setNewMessage}} >
      {props.children}
    </NewMessagesContext.Provider>
  )
}

export default NewMessagesContextProvider;