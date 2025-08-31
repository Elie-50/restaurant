import DietaryOptionsManager from '@/components/DietaryOptionsManager'
import FoodCategoryManager from '@/components/FoodCategoryManager'
import MenuItemsManager from '@/components/MenuItemManager'
import React from 'react'

function AdminMenu() {
  return (
    <div>
      <h2 className='page-header'>Menu Management</h2>

      <div>
        <h3 className='page-sub-header'>Dietary options</h3>
        <DietaryOptionsManager />
      </div>

      <div>
        <h3 className='page-sub-header'>Food Categories</h3>
        <FoodCategoryManager />
      </div>

      <div>
        <h3 className='page-sub-header'>Menu</h3>
        <MenuItemsManager />
      </div>
    </div>
  )
}

export default AdminMenu
