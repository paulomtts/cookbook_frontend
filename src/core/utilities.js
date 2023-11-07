const getFields = (data, avoid) => {
    if(!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => !avoid.includes(key));
} // reason: filter fields from data


export { getFields };