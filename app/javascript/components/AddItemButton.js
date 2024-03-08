import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useQuery } from '@tanstack/react-query';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useApi } from '../contexts/ApiContext';
import { Item } from '../models/Item';

export const CategorySelector = ({ category, onSelect }) => {
  const { api } = useApi();
  const { data: categories } = useQuery(api.getCategories());
  if (!categories) return null;

  const selectedCategoryId = category ? category.id : '';
  const handleSelect = (e) => {
    const categoryId = parseInt(e.target.value, 10);
    onSelect(categories.find((c) => c.id === categoryId));
  };

  return (
    <Form.Group>
      <Form.Select value={selectedCategoryId} onChange={handleSelect} required>
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export const AddItemButton = ({ category }) => {
  const { api, save } = useApi();
  const [error, setError] = useState(null);
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleSave = () => {
    api.createItem(new Item({ name: itemName, categoryId: selectedCategory.id, needed: true }));
    save().then(handleClose).catch(setError);
  };

  const renderError = () => {
    if (!error) return null;

    console.error('Error saving item', error);

    return (
      <Alert variant="danger">
        <Alert.Heading>Error saving</Alert.Heading>
        {JSON.stringify(error)}
      </Alert>
    );
  };

  const renderModal = () => {
    return (
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderError()}
          <Form.Group className="mb-3">
            <Form.Control
              required
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Form.Group>
          <CategorySelector category={selectedCategory} onSelect={setSelectedCategory} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      {renderModal()}
      <button className="btn" onClick={handleShow}>
        <i className="bi bi-plus-circle"></i>
      </button>
    </>
  );
};
