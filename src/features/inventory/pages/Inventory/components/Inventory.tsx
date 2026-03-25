import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventoryData } from '../../../store/actions';
import { InventorySplitView } from './InventorySplitView';

const Inventory = () => {
    const dispatch = useDispatch<any>();
    const { data: inventory, loading } = useSelector((state: any) => state.inventory);
    const [selectedInventory, setSelectedInventory] = useState<any>(null);

    useEffect(() => {
        dispatch(getInventoryData());
    }, [dispatch]);

    const handleOpenModal = (item: any = null) => {
        console.log("Open Modal for:", item);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked for:", id);
    };

    return (
        <div className="inventory-page-container w-full h-full flex flex-col">
            <InventorySplitView
                inventory={inventory}
                selectedInventory={selectedInventory}
                setSelectedInventory={setSelectedInventory}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                loading={loading}
            />
        </div>
    );
};

export default Inventory;
