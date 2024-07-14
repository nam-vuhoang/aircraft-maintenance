# Requirement Analysis and Assumptions

In this section, I describe how I understand the requirements, explain why I added new requirements, and made some assumptions.

## Functional Requirements

### Brief Summary

The task involves building a full-stack application featuring a timeline view that displays flights and maintenance tasks (work packages). The time range at the top of the timeline view should dynamically render with both hourly and daily time units. Additionally, the timeline should be draggable, scrollable, and optionally zoomable.

The backend should provide a RESTful API to support `GET` operations on these resources.

### Self-defined Additional Requirements

To enhance the functionality of the application, the following features have been added:

1. **Timeline View with Multiple Time Ruler Options**:

   - Users can select combinations of time units (`Hours`, `Days`, `Weeks`, `Months`) for the time ruler format, such as `Days + 3 Hours` or `Months + Weeks + Days`, to accommodate time ranges from a few hours to several months.
   - Users should be able to zoom in and out of the timeline or select the `Auto` zooming option.

2. **Aircraft Task Groups**:
   - Flights and maintenance work packages related to a single aircraft are grouped together.
   - These groups can be collapsed (by default) or expanded as needed.
3. **RESTful API with Full CRUD Operations and Swagger Documentation**:

   - The API supports not only GET operations but also create, update, and delete operations for flights and work packages. It also supports batch import of JSON data, with formats defined in the sample files included in the project assignment.
   - To facilitate the creation of multi-select controllers on the UI, the backend provides the ability to retrieve lists of unique registration numbers, stations, and other relevant data.
   - A Swagger documentation endpoint is included to assist users in understanding and testing the RESTful API directly.

4. **Import Page**:

   - This page allows users to add new flights and work packages to the application for testing purposes.

5. **Flight and Work Package Pages**:
   - These pages enable users to view and verify data in a table format.
   - They are implemented separately because flights and work packages have different data fields.

### Self-defined Additional Requirements

1. **Reusable Frontend Modules**
   - Common React components and utility classes that are not specific to this application, such as the `Gantt Chart` component without aircraft-specific details, should be defined in separate modules. This allows these components and utilities to be reused in other applications.

### Constraints and Assumptions

1. **Data Definitions**:

   - The `Start Time` and `End Time` of flights displayed in the timeline are determined by prioritizing the actual departure/arrival time, followed by the estimated time if actual data is unavailable, and finally the scheduled time if neither actual nor estimated times are provided.

2. **Data Validation:**

   - When creating or updating data, the application validates only the data types to maintain data integrity.
   - The application does not validate data values, meaning it does not check for overlapping or non-connected flights or tasks with duplicate IDs.

3. **Pagination and Sorting:**

   - Pagination and sorting features are currently not supported due to limited implementation time.

4. **Updating and Deleting Data:**
   - The application does not support updating or deleting data in the UI. If needed, updating and deleting single objects can be done via the backend API using their unique IDs.

## Non-functional Requirements

### Brief Summary

The programming challenge suggests using `Node.js` with `TypeScript` for the backend and `React.js` with `Vite` and `TypeScript` for the frontend. Either an in-memory database or Dockerized `PostgreSQL` can be selected for data persistence. Both the backend and frontend applications should be containerized using `Docker`, include unit tests for critical parts and proper error handling. They can include only well-maintained packages with open-source licenses.

### Constraints and Assumptions

1. **Data Volume and Performance**:
   - Because no constraints on data volume and performance were mentioned in the task assignment, I assume that the amount of data is not too large. Therefore, special performance-improving techniques such as caching data or indexing data tables are not required.
2. **Simple Database Design**:

   - The database was designed to address only the current requirements without anticipating future needs.

3. **Optional Database Views**:
   - To assist users who want to validate data using SQL, I created a database view called `flights_view`, which calculates `Start Time` and `End Time` of flights as defined above. This database view is not used by the backend.
