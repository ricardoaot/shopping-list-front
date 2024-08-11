// pages/index.tsx
"use client";

import { useContext, useEffect, useState } from 'react';

import { useSocket } from '../context/SocketContext';


import { Container, Typography, List, ListItem, ListItemText, IconButton, Checkbox, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';

interface Item {
  id: string;
  name: string;
  purchased: boolean;
}

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  
  const socket = useSocket();

  useEffect(() => {
    if (socket) {

      const fetchItems = async () => {
        const res = await fetch('http://localhost:5000/items');
        const data = await res.json();
        setItems(data);
      };
      console.log('Loading items...');

      fetchItems();
      //socket.on('itemAdded', fetchItems);
      socket.on('itemAdded', (item) => {
        console.log('Evento itemAdded recibido:', item);  // Imprime el evento y los datos
        fetchItems();
      });

      socket.on('itemUpdated', fetchItems);
      socket.on('itemDeleted', fetchItems);

      return () => {
        //socket.off('itemAdded', fetchItems);
        socket.off('itemAdded', (item) => {
          console.log('Evento itemAdded recibido:', item);  // Imprime el evento y los datos
          fetchItems();
        });
        socket.off('itemUpdated', fetchItems);
        socket.off('itemDeleted', fetchItems);
      };
    }

  }, [socket]);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE' });
  };

  const handleTogglePurchased = async (id: string, purchased: boolean) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchased: !purchased }),
    });
  };

  return (
    <Container component={Paper} sx={{ padding: 3, marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        Shopping List
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <Checkbox
              checked={item.purchased}
              onChange={() => handleTogglePurchased(item.id, item.purchased)}
              icon={<UndoIcon />}
              checkedIcon={<CheckIcon />}
              sx={{ marginRight: 2 }}
            />
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{ 
                sx: { 
                  //textDecoration: 'line-through' 
                  textDecoration: item.purchased ? 'line-through' : 'none' 
                } 
              }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Home;
