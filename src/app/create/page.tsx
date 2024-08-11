"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const CreateItem: React.FC = () => {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    router.push('/');
  };

  return (
    <Container component={Paper} sx={{ padding: 3, marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        Create New Item
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
          Create Item
        </Button>
      </form>
    </Container>
  );
};

export default CreateItem;
