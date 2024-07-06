import React from 'react';
import GanttChart from './components/GanttChart/GanttChart';
import { ChakraProvider } from '@chakra-ui/react';
import { TaskGroup } from './models/TaskGroup';
import TimeRuler from './components/TimeRuler/TimeRuler';
import ColorfulTable from './components/ColorfulTable/ColorfulTable';
import { getDefaultTimeScaleFormat } from './components/TimeRuler';

const generateTasks = (groupId: number): { id: number; name: string; start: Date; end: Date; type: number }[] => {
  if (groupId % 10 === 0) {
    // Create overlapping tasks for every third group
    return [
      {
        id: groupId * 10 + 1,
        name: `Task ${groupId}-1`,
        start: new Date(`2024-07-01`),
        end: new Date(`2024-07-05`),
        type: 1,
      },
      {
        id: groupId * 10 + 2,
        name: `Task ${groupId}-2`,
        start: new Date(`2024-07-04`),
        end: new Date(`2024-07-08`),
        type: 2,
      },
      {
        id: groupId * 10 + 3,
        name: `Task ${groupId}-3`,
        start: new Date(`2024-07-06`),
        end: new Date(`2024-07-10`),
        type: 1,
      },
    ];
  } else {
    // Create non-overlapping tasks
    return [
      {
        id: groupId * 10 + 1,
        name: `Task ${groupId}-1`,
        start: new Date(`2024-07-${String(groupId).padStart(2, '0')}`),
        end: new Date(`2024-07-${String(groupId + 1).padStart(2, '0')}`),
        type: 1,
      },
      {
        id: groupId * 10 + 2,
        name: `Task ${groupId}-2`,
        start: new Date(`2024-07-${String(groupId + 2).padStart(2, '0')}`),
        end: new Date(`2024-07-${String(groupId + 3).padStart(2, '0')}`),
        type: 2,
      },
    ];
  }
};

const taskGroups: TaskGroup[] = [
  { name: 'Group 1', tasks: generateTasks(1) },
  { name: 'Group 2', tasks: generateTasks(2) },
  { name: 'Group 3', tasks: generateTasks(3) },
  { name: 'Group 4', tasks: generateTasks(4) },
  { name: 'Group 5', tasks: generateTasks(5) },
  { name: 'Group 6', tasks: generateTasks(6) },
  { name: 'Group 7', tasks: generateTasks(7) },
  { name: 'Group 8', tasks: generateTasks(8) },
  { name: 'Group 9', tasks: generateTasks(9) },
  { name: 'Group 10', tasks: generateTasks(10) },
];

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <div>
        {/* <div>
          <h1>Colorful Table Example</h1>
          <ColorfulTable />
        </div> */}
        <h1>Gantt Chart</h1>
        <GanttChart taskGroups={taskGroups} />
        {/* <TimeRuler
          minTime={new Date(2024, 6, 2, 22, 15)}
          maxTime={new Date(2024, 6, 25, 12, 14)}
          units={['day', 'hour-3']}
          onStateChange={(state) => console.log(state)}
        />
        <TimeRuler
          minTime={new Date(2024, 5, 30, 13, 15)}
          maxTime={new Date(2024, 7, 5, 12, 15)}
          units={['month', 'week', 'day']}
          minUnitWidth={30}
          onStateChange={(state) => console.log(state)}
        /> */}
        {/* 
        {/* <TimeRuler mode="days" startDate={new Date(2024, 6, 1)} endDate={new Date(2024, 6, 7)} />
        <TimeRuler mode="months" startDate={new Date(2024, 0, 1)} endDate={new Date(2024, 11, 31)} /> */}
      </div>
    </ChakraProvider>
  );
};

export default App;
