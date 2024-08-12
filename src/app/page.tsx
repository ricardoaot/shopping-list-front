// pages/index.tsx
"use client";

import { useContext, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Checkbox, TextField, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CheckboxOutlineIcon from '@mui/icons-material/CheckBoxOutlineBlank';  


interface Item {
  id: string;
  name: string;
  purchased: boolean;
}
const urlApp = 'http://localhost:5000'

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [newItemName, setNewItemName] = useState<string>('');

  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      console.log('Loading items...');
      fetchItems();
      socket.on('itemAdded', fetchItems);
      socket.on('itemUpdated', fetchItems);
      socket.on('itemDeleted', fetchItems);

      return () => {
        socket.off('itemAdded', fetchItems);
        socket.off('itemUpdated', fetchItems);
        socket.off('itemDeleted', fetchItems);
      };
    }
  }, [socket]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${urlApp}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDelete = async (id: string) => {
    //await fetch(`${urlApp}/items/${id}`, { method: 'DELETE' });
    try {
      await axios.delete(`${urlApp}/items/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleTogglePurchased = async (id: string, purchased: boolean) => {
    try {
      await axios.put(`${urlApp}/items/${id}`, {
        purchased: !purchased,
      });
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item.id);
    setEditName(item.name);
  };

  const handleSaveClick = async (id: string) => {
    /*
      await fetch(`${urlApp}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
    */

    try {
      await axios.put(`${urlApp}/items/${id}`, {
        name: editName,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddItem = async () => {
    if (newItemName.trim() === '') return;

    try {
      await axios.post(`${urlApp}/items`, {
        name: newItemName,
        purchased: false,
      });
      setNewItemName('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <Container component={Paper} sx={{ padding: 3, marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        Shopping List
      </Typography>

      <TextField
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key === "Enter"){
            e.preventDefault();
            handleAddItem()
          }
        }}
        size="small"
        label="Add new item"
        sx={{ marginBottom: 2, width: '100%' }}
      />
      <Button
        onClick={handleAddItem}
        variant="contained"
        sx={{ marginBottom: 2 }}
      >
        Add Item
      </Button>

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
              icon={<CheckboxOutlineIcon />}
              checkedIcon={<CheckIcon />}
              sx={{ marginRight: 2 }}
            />
            {editingItem === item.id ? (
              <>
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="small"
                  sx={{ marginRight: 2 }}
                />
                <Button onClick={() => handleSaveClick(item.id)} variant="contained">Save</Button>
              </>
            ) : (
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ 
                  sx: { 
                    textDecoration: item.purchased ? 'line-through' : 'none' 
                  } 
                }}
                onClick={() => handleEditClick(item)}
                sx={{ cursor: 'pointer' }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Home;
