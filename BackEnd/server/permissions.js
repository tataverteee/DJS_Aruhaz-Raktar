// Szerepkör -> jogosultságok.
// Ami nincs felsorolva, az tiltott.

export const ROLE_PERMISSIONS = {
  guest: [
    'product_stock_view',
    'customer_order_create',
    'customer_data_create',
  ],
  warehouse: [
    'warehouse_stock_view',
    'goods_receipt_create',
    'goods_issue_create',
    'goods_movement_create',
  ],
  manager: [
    'warehouse_stock_view',
    'statistics_manage',
  ],
  admin: [
    'product_stock_view',
    'customer_order_create',
    'customer_data_create',
    'warehouse_stock_view',
    'goods_receipt_create',
    'goods_issue_create',
    'goods_movement_create',
    'product_list_edit',
    'product_type_list_edit',
    'product_order_to_warehouse',
    'user_register',
    'statistics_manage',
  ],
}

// Igaz, ha a szerepkör rendelkezik a jogosultsággal.
// Ismeretlen szerepkörre mindig hamis.
export function hasPermission(role, permission) {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission)
}
