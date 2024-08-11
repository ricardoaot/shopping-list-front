"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

interface Item {
  id: string;
  name: string;
}

const EditItem: React.FC = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState('');
  const router = useRouter();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const res = await fetch(`http://localhost:5000/items/${id}`);
      const data = await res.json();
      setItem(data);
      setName(data.name);
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    await fetch(`http://localhost:5000/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    router.push('/');
  };

  if (!item) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Container component={Paper} sx={{ padding: 3, marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        Edit Item
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Item Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Update Item
        </Button>
      </form>
    </Container>
  );
};

export default EditItem;
