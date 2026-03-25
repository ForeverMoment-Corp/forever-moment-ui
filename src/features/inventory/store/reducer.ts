import * as types from './action-types';

const initialState = {
    data: [
        { id: 'INV-1001', name: 'Premium Decor Set - Rose Gold', category: 'Decor', quantity: 15, unit: 'Set', status: 'In Stock', location: 'Warehouse A' },
        { id: 'INV-1002', name: 'Professional Camera Body - Sony A7IV', category: 'Electronics', quantity: 4, unit: 'Unit', status: 'Lent Out', location: 'Site - Goa' },
        { id: 'INV-1003', name: 'Vintage Candle Holders', category: 'Props', quantity: 50, unit: 'Piece', status: 'In Stock', location: 'Warehouse B' },
        { id: 'INV-1004', name: 'Warm White Fairy Lights (20m)', category: 'Electronics', quantity: 120, unit: 'Roll', status: 'Low Stock', location: 'Warehouse A' },
        { id: 'INV-1005', name: 'Artificial Flower Walls - 8x8ft', category: 'Decor', quantity: 6, unit: 'Unit', status: 'In Stock', location: 'Warehouse B' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const inventoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_INVENTORY_DATA:
            return { ...state, loading: true };
        case types.GET_INVENTORY_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_INVENTORY_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
