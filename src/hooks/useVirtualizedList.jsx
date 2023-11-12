import { useState, useEffect } from "react";

export const useVirtualizedList = (data, conditionsCallback, rowHeight, containerRef, numberOfRows = 10, lookFactor = 5) => {
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

        const slicedData = data.slice(lookBehind, lookAhead).filter(conditionsCallback);
        const newVisibleData = slicedData.map((row) => { 
            if (conditionsCallback(row)) return row;
        });


        setVisibleData(newVisibleData);
        console.log(lookBehind, startVisible, lookAhead);
    }

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
