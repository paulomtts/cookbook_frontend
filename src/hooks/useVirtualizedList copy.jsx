import { useState, useEffect } from "react";

export const useVirtualizedList = (data, conditionsCallback, builderCallback, triggers, containerRef, rowHeight = 36, numberOfRows = 10, lookFactor = 5) => {

    const [filteredData, setFilteredData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);
    const [prevHeight, setPrevDivHeight] = useState(0);
    const [postHeight, setPostDivHeight] = useState(0);

    const updateVisibleItems = () => {       
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

    const buildList = () => {
        const newFilteredData = data.reduce((acc, row) => {
            if (conditionsCallback(row)) acc.push(builderCallback(row));
            return acc;
        }, []);

        setFilteredData(newFilteredData);
    }

    useEffect(() => {
        buildList();
        updateVisibleItems();
    }, [data, ...triggers]);


    useEffect(() => {
        if (!containerRef.current) return;

        updateVisibleItems();

        containerRef.current.addEventListener("scroll", updateVisibleItems);
        return () => {
            containerRef.current.removeEventListener("scroll", updateVisibleItems);
        }
    }, [data]);

    return [visibleData, prevHeight, postHeight];
}
