import { useState, useEffect } from "react";

/**
 * A custom hook that returns a virtualized list of data based on the given parameters.
 * @param {Array} data - The data to be displayed in the list.
 * @param {Function} conditionsCallback - A callback function that returns a boolean value indicating whether a row should be included in the list or not.
 * @param {Function} builderCallback - A callback function that returns a React component to be rendered for each row in the list.
 * @param {Array} triggers - An array of values that, when changed, will trigger the hook to update the list.
 * @param {Object} containerRef - A reference to the container element that holds the list.
 * @param {number} rowHeight - The height of each row in the list. Default: 36
 * @param {number} numberOfRows - The number of rows to be displayed in the list at a time. Default: 10
 * @param {number} lookFactor - The number of rows to look ahead and behind the visible area of the list to determine which rows to render. Default: 5
 * @returns {[Array, number, number]} - An array containing the visible data, the height of the content before the visible area, and the height of the content after the visible area.
 */
export const useVirtualizedList = (data, conditionsCallback, builderCallback, triggers, containerRef, rowHeight = 36, numberOfRows = 10, lookFactor = 5) => {

    const [visibleData, setVisibleData] = useState([]);
    const [prevHeight, setPrevDivHeight] = useState(0);
    const [postHeight, setPostDivHeight] = useState(0);
    
    const buildList = () => {
        return data.reduce((acc, row) => {
            if (conditionsCallback(row)) acc.push(builderCallback(row));
            return acc;
        }, []);
    }

    const updateVisibleItems = (filteredData) => {
        const scrollTop = containerRef.current.scrollTop;

        const startVisible = Math.floor(scrollTop / rowHeight);
        const endVisible = startVisible + numberOfRows;

        const lookBehind = (startVisible - (lookFactor * numberOfRows)) < 0 ? 0 : startVisible - (lookFactor * numberOfRows);
        const lookAhead = endVisible + (lookFactor * numberOfRows) > data.length ? data.length : endVisible + (lookFactor * numberOfRows);
        
        const newPrevDivHeight = lookBehind * rowHeight;
        const newPostDivHeight = (data.length - lookAhead) * rowHeight;

        setPrevDivHeight(newPrevDivHeight);
        setPostDivHeight(newPostDivHeight);
        const slicedData = filteredData.slice(lookBehind, lookAhead);

        setVisibleData(slicedData);
    }   
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        const filteredData = buildList();
        
        updateVisibleItems(filteredData);

        const handleScroll = () => updateVisibleItems(filteredData);
        
        containerRef.current.addEventListener("scroll", handleScroll);
        return () => {
            if (!containerRef.current) return;
            console.log('this is not being run')
            containerRef.current.removeEventListener("scroll", handleScroll);
        }
    }, [data, ...triggers]);

    return [visibleData, prevHeight, postHeight];
}
