export const fetchCustomers = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]); // Real API would be here
        }, 500);
    });
};
