// ------------------
// Storage Controller
// ------------------
const StorageCtrl = (function(){
  

  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in localStorage
      if(localStorage.getItem('items') === null){
        items = [];
        // Push the new item
        items.push(item);
        // Set localStorage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get items from localStorage
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item to items array
        items.push(item);
        // Set in localStorage again
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));
      // Loop through
      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      // Set in localStorage again
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      // Loop through
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      // Set in localStorage again
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

// ---------------
// Item Controller
// ---------------
const ItemCtrl = (function(){
  // Item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const state = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return state.items;
    },
    addItem: function(name, calories){
      // Create ID
      let id;
      if(state.items.length > 0){
        id = state.items[state.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(id, name, calories);

      // Add newItem to state.items
      state.items.push(newItem);
      
      return newItem;

    },
    getTotalCalories: function(){
      let total = 0;
      // Loop through items and add calories
      state.items.forEach(function(item){
        total += item.calories;
      });
      
      // Set state totalCalories to the total
      state.totalCalories = total;

      // Return totalCalories
      return state.totalCalories; 
    },
    getItemById: function(id){
      let found = null;
      // Loop through items
      state.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      
      return found;
    },
    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      // Loop through items
      state.items.forEach(function(item){
        if(item.id === state.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id){
      // Get ids
      ids = state.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      state.items.splice(index, 1);
    },
    clearAllItems: function(){
      state.items = [];
    },
    setCurrentItem: function(item){
      state.currentItem = item;
    },
    getCurrentItem: function(){
      return state.currentItem;
    },
    logState: function(){
      return state;
    }
  };
})();


// -------------
// UI Controller
// -------------
const UICtrl = (function(){

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  };

  // Public methods
  return {
    createItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });

      // Insert Item List
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    getSelectors: function(){
      return UISelectors;
    },
    addListItem: function(item){
      // Show the hidden list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add id
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      // Loop through array
      listItems.forEach(function(listItem){
        let itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function(id){
      // Define class with id passed
      const itemID = `#item-${id}`;
      // Get item by its ID
      const item = document.querySelector(itemID);
      // Remove item from UI
      item.remove();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      // Loop through array and remove each member
      listItems.forEach(function(item){
        item.remove();
      });
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    }
  };
})();


// --------------
// App Controller
// --------------
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
      }
      return false;
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear all event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // Add Item Submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item to State
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      
      // Add totalCalories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  // Click edit item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the numeric part of id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e){
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item in state
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update item in UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
      
    // Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update localStorage
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear the edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete item submit
  const itemDeleteSubmit = function(e){
    // Get currentItem
    const currentItem = ItemCtrl.getCurrentItem();
    
    // Delete from state
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
      
    // Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from localStorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // Clear the edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Clear all items
  const clearAllItemsClick = function(){

    // Delete all items from state
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
      
    // Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete all items from UI
    UICtrl.removeItems();

    // Delete all items from localStorage
    StorageCtrl.clearAllFromStorage();

    // Hide UL
    UICtrl.hideList();
  }

  // Public methods
  return {
    init: function(){
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from state
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Create list with items
        UICtrl.createItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      
      // Add totalCalories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };

})(ItemCtrl, StorageCtrl, UICtrl);


// Initializing App
App.init();

