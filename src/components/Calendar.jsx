/* Foreign dependencies */
import React from "react";

export default function Calendar() {
    const newDate = new Date();
    newDate.setDate(1)
    
    const startDayOfWeek = newDate.getDay();
    const currYear = newDate.getFullYear();
    const currMonth = newDate.getMonth();

    const daysInCurrMonth = new Date(currYear, currMonth + 1, 0).getDate();

    return (
        <div 
        style={{
            border: '2px solid white'
            , borderRadius: '10px'
            , backgroundColor: 'rgb(244, 237, 228)'
            , padding: '10px'
            , boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)'
        }}
    >
        {/* display current date */}
        <h4 style={{textAlign: 'center', margin: '5px 0px 20px 0px'}}>
            {new Date().toDateString()}
        </h4>

        {[1, 2, 3, 4, 5].map((week) => {
            return (
                <div style={{ display: 'flex'}}>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {

                const dayValue = (week - 1) * 7 + day - startDayOfWeek;
                    return (
                    <div
                        style={{
                        width: '45px',
                        margin: '3px',
                        height: '45px',
                        borderRadius: '5px',
                        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 1)',
                        color: 'white',
                        backgroundColor: 
                            // if day is current day, differnt color
                            dayValue === new Date().getDate() ? '#ff2f00' :
                            // if day is in current month, different color
                            dayValue >= 1 && dayValue <= daysInCurrMonth ? '#ff8f00' :
                            // else, different color
                            '#ffab40',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}
                    >
                        {dayValue >= 1 && dayValue <= daysInCurrMonth ? (
                        <span style={{ fontSize: '30px', textShadow: '1px 0px 3px black', userSelect: 'none', cursor: 'pointer' }}>
                            {dayValue}
                        </span>
                        ) : null}
                    </div>
                    );
                })}
                </div>
            );
        })}
    </div>
    )
}