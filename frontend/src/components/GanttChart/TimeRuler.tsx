import React from 'react';

interface TimeRulerProps {
    startTime: Date;
    endTime: Date;
}

const TimeRuler: React.FC<TimeRulerProps> = ({ startTime, endTime }) => {
    const renderTimeMarks = () => {
        const marks = [];
        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            marks.push(
                <div key={currentTime.getTime()} className="time-mark">
                    {currentTime.getHours()}:00
                </div>
            );

            currentTime.setHours(currentTime.getHours() + 1);
        }

        return marks;
    };

    return (
        <div className="time-ruler" style={{ display: 'flex', flexDirection: 'row', maxHeight: 35 }}>
            {renderTimeMarks()}
        </div>
    );
};

export default TimeRuler;