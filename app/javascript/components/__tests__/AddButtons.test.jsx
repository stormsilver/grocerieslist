import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AddCategoryButton } from '../AddCategoryButton';
import { AddItemButton } from '../AddItemButton';

const createCategory = vi.fn();
const createItem = vi.fn();
const save = vi.fn(() => Promise.resolve());

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [{ id: 1, name: 'Pantry' }] }),
}));

vi.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({
    api: {
      createCategory,
      createItem,
      getCategories: () => ({ queryKey: ['categories'] }),
    },
    save,
  }),
}));

vi.mock('react-bootstrap/Modal', () => {
  const Modal = ({ show, children }) => (show ? <div>{children}</div> : null);
  Modal.Header = ({ children }) => <div>{children}</div>;
  Modal.Title = ({ children }) => <div>{children}</div>;
  Modal.Body = ({ children }) => <div>{children}</div>;
  Modal.Footer = ({ children }) => <div>{children}</div>;

  return {
    __esModule: true,
    default: Modal,
  };
});

vi.mock('react-bootstrap/Button', () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('react-bootstrap/Form', () => {
  const Form = ({ children }) => <div>{children}</div>;
  Form.Group = ({ children }) => <div>{children}</div>;
  Form.Control = (props) => <input {...props} />;
  Form.Select = ({ children, ...props }) => <select {...props}>{children}</select>;

  return {
    __esModule: true,
    default: Form,
  };
});

vi.mock('react-bootstrap/Alert', () => {
  const Alert = ({ children }) => <div>{children}</div>;
  Alert.Heading = ({ children }) => <div>{children}</div>;

  return {
    __esModule: true,
    default: Alert,
  };
});

describe('Add buttons', () => {
  afterEach(() => {
    cleanup();
    createCategory.mockClear();
    createItem.mockClear();
    save.mockClear();
  });

  it('creates a category on save', async () => {
    const { container } = render(<AddCategoryButton />);

    fireEvent.click(container.querySelector('button'));
    fireEvent.change(screen.getByPlaceholderText('Category name'), { target: { value: 'Frozen' } });
    fireEvent.click(screen.getByText('Save'));

    expect(createCategory).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
  });

  it('creates an item on save', () => {
    const { container } = render(<AddItemButton category={{ id: 1, name: 'Pantry' }} />);

    fireEvent.click(container.querySelector('button'));
    fireEvent.change(screen.getByPlaceholderText('Item name'), { target: { value: 'Milk' } });
    fireEvent.click(screen.getByText('Save'));

    expect(createItem).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
  });
});
