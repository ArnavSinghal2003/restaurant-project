import { useEffect, useMemo, useState } from 'react';

import { usePageTitle } from '../hooks/usePageTitle';
import {
  createRestaurant,
  listRestaurants
} from '../services/restaurant.service';
import {
  createMenuItem,
  deleteMenuItem,
  listMenuItems,
  updateMenuItem,
  updateMenuItemAvailability
} from '../services/menuItem.service';
import {
  createTable,
  deleteTable,
  listTables,
  updateTable
} from '../services/table.service';
import RestaurantSelector from '../components/admin/RestaurantSelector';
import MenuItemForm from '../components/admin/MenuItemForm';
import MenuItemList from '../components/admin/MenuItemList';
import TableForm from '../components/admin/TableForm';
import TableList from '../components/admin/TableList';

const initialMenuForm = {
  name: '',
  category: '',
  price: '',
  description: '',
  dietaryTags: '',
  inventoryCount: '',
  isAvailable: true
};

const initialTableForm = {
  tableNumber: '',
  capacity: '4',
  qrToken: '',
  isActive: true
};

function buildMenuPayload(form) {
  const payload = {
    name: form.name.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    isAvailable: form.isAvailable
  };

  const description = form.description.trim();
  if (description) {
    payload.description = description;
  }

  const dietaryTags = form.dietaryTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (dietaryTags.length > 0) {
    payload.dietaryTags = dietaryTags;
  }

  const inventoryValue = String(form.inventoryCount).trim();
  if (inventoryValue !== '') {
    payload.inventoryCount = Number(inventoryValue);
  }

  return payload;
}

function buildTablePayload(form) {
  const payload = {
    tableNumber: form.tableNumber.trim(),
    capacity: Number(form.capacity),
    isActive: form.isActive
  };

  const qrToken = form.qrToken.trim();
  if (qrToken) {
    payload.qrToken = qrToken;
  }

  return payload;
}

function mapMenuItemToForm(menuItem) {
  return {
    name: menuItem.name || '',
    category: menuItem.category || '',
    price: menuItem.price ?? '',
    description: menuItem.description || '',
    dietaryTags: Array.isArray(menuItem.dietaryTags) ? menuItem.dietaryTags.join(', ') : '',
    inventoryCount: menuItem.inventoryCount ?? '',
    isAvailable: Boolean(menuItem.isAvailable)
  };
}

function mapTableToForm(table) {
  return {
    tableNumber: table.tableNumber || '',
    capacity: String(table.capacity ?? 4),
    qrToken: table.qrToken || '',
    isActive: Boolean(table.isActive)
  };
}

function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState(initialMenuForm);
  const [createRestaurantForm, setCreateRestaurantForm] = useState({ name: '', slug: '' });
  const [editingMenuItemId, setEditingMenuItemId] = useState('');
  const [creatingRestaurant, setCreatingRestaurant] = useState(false);
  const [isSavingMenuItem, setIsSavingMenuItem] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [pendingMenuItemId, setPendingMenuItemId] = useState('');
  const [tables, setTables] = useState([]);
  const [tableForm, setTableForm] = useState(initialTableForm);
  const [editingTableId, setEditingTableId] = useState('');
  const [isSavingTable, setIsSavingTable] = useState(false);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [pendingTableId, setPendingTableId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  usePageTitle('Admin Dashboard | TableFlow');

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant._id === selectedRestaurantId) || null,
    [restaurants, selectedRestaurantId]
  );

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (!selectedRestaurantId) {
      setMenuItems([]);
      setTables([]);
      return;
    }

    loadMenuItems(selectedRestaurantId);
    loadTables(selectedRestaurantId);
  }, [selectedRestaurantId]);

  async function loadRestaurants(preferredRestaurantId = '') {
    try {
      const response = await listRestaurants({ includeInactive: true });
      const fetched = response.items || [];
      setRestaurants(fetched);

      if (preferredRestaurantId) {
        setSelectedRestaurantId(preferredRestaurantId);
      } else if (!selectedRestaurantId && fetched.length > 0) {
        setSelectedRestaurantId(fetched[0]._id);
      } else if (
        selectedRestaurantId &&
        !fetched.some((restaurant) => restaurant._id === selectedRestaurantId)
      ) {
        setSelectedRestaurantId(fetched[0]?._id || '');
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load restaurants.');
    }
  }

  async function loadMenuItems(restaurantId) {
    setIsLoadingMenu(true);
    setErrorMessage('');

    try {
      const response = await listMenuItems(restaurantId, { includeUnavailable: true });
      setMenuItems(response.items || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load menu items.');
    } finally {
      setIsLoadingMenu(false);
    }
  }

  async function loadTables(restaurantId) {
    setIsLoadingTables(true);
    setErrorMessage('');

    try {
      const response = await listTables(restaurantId, { includeInactive: true });
      setTables(response.items || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load tables.');
    } finally {
      setIsLoadingTables(false);
    }
  }

  async function handleCreateRestaurant(event) {
    event.preventDefault();
    setCreatingRestaurant(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const payload = { name: createRestaurantForm.name.trim() };

      if (createRestaurantForm.slug.trim()) {
        payload.slug = createRestaurantForm.slug.trim();
      }

      const restaurant = await createRestaurant(payload);
      await loadRestaurants(restaurant._id);
      setCreateRestaurantForm({ name: '', slug: '' });
      setStatusMessage(`Restaurant created: ${restaurant.name}`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to create restaurant.');
    } finally {
      setCreatingRestaurant(false);
    }
  }

  async function handleSubmitMenuItem(event) {
    event.preventDefault();

    if (!selectedRestaurantId) {
      setErrorMessage('Please select a restaurant first.');
      return;
    }

    setIsSavingMenuItem(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const payload = buildMenuPayload(menuForm);

      if (editingMenuItemId) {
        const updated = await updateMenuItem(selectedRestaurantId, editingMenuItemId, payload);
        setMenuItems((current) =>
          current.map((item) => (item._id === editingMenuItemId ? updated : item))
        );
        setStatusMessage(`Menu item updated: ${updated.name}`);
      } else {
        const createdItem = await createMenuItem(selectedRestaurantId, payload);
        setMenuItems((current) => [createdItem, ...current]);
        setStatusMessage(`Menu item created: ${createdItem.name}`);
      }

      setMenuForm(initialMenuForm);
      setEditingMenuItemId('');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to save menu item.');
    } finally {
      setIsSavingMenuItem(false);
    }
  }

  function handleMenuFormChange(event) {
    const { name, value, type, checked } = event.target;
    setMenuForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleCreateRestaurantFormChange(event) {
    const { name, value } = event.target;
    setCreateRestaurantForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleEditMenuItem(item) {
    setMenuForm(mapMenuItemToForm(item));
    setEditingMenuItemId(item._id);
    setStatusMessage('');
    setErrorMessage('');
  }

  function handleCancelEdit() {
    setMenuForm(initialMenuForm);
    setEditingMenuItemId('');
  }

  function handleTableFormChange(event) {
    const { name, value, type, checked } = event.target;
    setTableForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleEditTable(table) {
    setTableForm(mapTableToForm(table));
    setEditingTableId(table._id);
    setStatusMessage('');
    setErrorMessage('');
  }

  function handleCancelTableEdit() {
    setTableForm(initialTableForm);
    setEditingTableId('');
  }

  async function handleSubmitTable(event) {
    event.preventDefault();

    if (!selectedRestaurantId) {
      setErrorMessage('Please select a restaurant first.');
      return;
    }

    setIsSavingTable(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const payload = buildTablePayload(tableForm);

      if (editingTableId) {
        const updated = await updateTable(selectedRestaurantId, editingTableId, payload);
        setTables((current) =>
          current.map((table) => (table._id === editingTableId ? updated : table))
        );
        setStatusMessage(`Table updated: ${updated.tableNumber}`);
      } else {
        const createdTable = await createTable(selectedRestaurantId, payload);
        setTables((current) => [createdTable, ...current]);
        setStatusMessage(`Table created: ${createdTable.tableNumber}`);
      }

      setTableForm(initialTableForm);
      setEditingTableId('');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to save table.');
    } finally {
      setIsSavingTable(false);
    }
  }

  async function handleToggleTableActive(table) {
    if (!selectedRestaurantId) return;

    setPendingTableId(table._id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const updated = await updateTable(selectedRestaurantId, table._id, {
        isActive: !table.isActive
      });

      setTables((current) =>
        current.map((existing) => (existing._id === table._id ? updated : existing))
      );
      setStatusMessage(`Table ${updated.tableNumber} status updated`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to update table status.');
    } finally {
      setPendingTableId('');
    }
  }

  async function handleDeleteTable(table) {
    if (!selectedRestaurantId) return;

    const shouldDelete = window.confirm(`Delete table "${table.tableNumber}" permanently?`);
    if (!shouldDelete) return;

    setPendingTableId(table._id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      await deleteTable(selectedRestaurantId, table._id);
      setTables((current) => current.filter((existing) => existing._id !== table._id));
      if (editingTableId === table._id) {
        handleCancelTableEdit();
      }
      setStatusMessage(`Deleted table: ${table.tableNumber}`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to delete table.');
    } finally {
      setPendingTableId('');
    }
  }

  async function handleToggleAvailability(item) {
    if (!selectedRestaurantId) return;

    setPendingMenuItemId(item._id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const response = await updateMenuItemAvailability(
        selectedRestaurantId,
        item._id,
        !item.isAvailable
      );

      setMenuItems((current) =>
        current.map((menuItem) =>
          menuItem._id === item._id
            ? {
                ...menuItem,
                isAvailable: response.isAvailable
              }
            : menuItem
        )
      );

      setStatusMessage(`Availability updated for ${item.name}`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to update availability.');
    } finally {
      setPendingMenuItemId('');
    }
  }

  async function handleDeleteMenuItem(item) {
    if (!selectedRestaurantId) return;

    const shouldDelete = window.confirm(`Delete "${item.name}" permanently?`);
    if (!shouldDelete) return;

    setPendingMenuItemId(item._id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      await deleteMenuItem(selectedRestaurantId, item._id);
      setMenuItems((current) => current.filter((menuItem) => menuItem._id !== item._id));
      if (editingMenuItemId === item._id) {
        handleCancelEdit();
      }
      setStatusMessage(`Deleted: ${item.name}`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to delete menu item.');
    } finally {
      setPendingMenuItemId('');
    }
  }

  return (
    <section className="container admin-page page-shell">
      <p className="eyebrow">Admin Route</p>
      <h1>Menu Management Dashboard</h1>
      <p className="hero-copy">
        Phase 1 admin workflow: choose restaurant context, manage menu catalog, and control item
        availability in real time.
      </p>

      <RestaurantSelector
        restaurants={restaurants}
        selectedRestaurantId={selectedRestaurantId}
        onRestaurantChange={setSelectedRestaurantId}
        createForm={createRestaurantForm}
        onCreateFormChange={handleCreateRestaurantFormChange}
        onCreateRestaurant={handleCreateRestaurant}
        creatingRestaurant={creatingRestaurant}
      />

      {selectedRestaurant ? (
        <p className="context-info">
          Selected: <strong>{selectedRestaurant.name}</strong> ({selectedRestaurant.slug})
        </p>
      ) : (
        <p className="context-info">Select or create a restaurant to manage its menu.</p>
      )}

      {statusMessage ? <p className="success-text">{statusMessage}</p> : null}
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <div className="admin-grid">
        <MenuItemForm
          form={menuForm}
          onChange={handleMenuFormChange}
          onSubmit={handleSubmitMenuItem}
          isSaving={isSavingMenuItem}
          isEditing={Boolean(editingMenuItemId)}
          onCancelEdit={handleCancelEdit}
          disabled={!selectedRestaurantId}
        />

        {isLoadingMenu ? (
          <section className="admin-panel">
            <h2>Loading menu...</h2>
          </section>
        ) : (
          <MenuItemList
            items={menuItems}
            onEdit={handleEditMenuItem}
            onDelete={handleDeleteMenuItem}
            onToggleAvailability={handleToggleAvailability}
            pendingItemId={pendingMenuItemId}
          />
        )}
      </div>

      <div className="admin-grid table-section-grid">
        <TableForm
          form={tableForm}
          onChange={handleTableFormChange}
          onSubmit={handleSubmitTable}
          isSaving={isSavingTable}
          isEditing={Boolean(editingTableId)}
          onCancelEdit={handleCancelTableEdit}
          disabled={!selectedRestaurantId}
        />

        {isLoadingTables ? (
          <section className="admin-panel">
            <h2>Loading tables...</h2>
          </section>
        ) : (
          <TableList
            tables={tables}
            onEdit={handleEditTable}
            onDelete={handleDeleteTable}
            onToggleActive={handleToggleTableActive}
            pendingTableId={pendingTableId}
          />
        )}
      </div>
    </section>
  );
}

export default AdminPage;
