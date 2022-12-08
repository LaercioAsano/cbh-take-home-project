# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket 1 - Create CustomAgentId table

#### Description
Create a new table called CustomAgentId with three fields:
- AgentId - FK to Agent
- FacilityId - FK to Facility
- CustomId - Non nullable String

The pair (AgentId, FacilityId) should be unique.

#### Effort estimate
- 2h

#### Acceptance criteria
1 - The database creation scripts create the described table.
2 - There is a new update script that updates the latest version of the database to add the described table.
3 - Any ORM configuration files are updated to include the newly created table.

### Ticket 2 - Create `setCustomAgentId` function

#### Description
Create a new function called setCustomAgentId to set the custom id provided by the user. This function should:
- Accept AgentId as input.
- Accept FacilityId as input.
- Accept CustomId as input.
- Create a new entry in the CustomAgentId based on the inputs.
- Return an execution status code.

#### Effort estimate
- 6h

#### Acceptance criteria
1 - When valid data is provided to the function a new entry is created in the database and the function should return success.
2 - When AgentId or FacilityId are not found on the database, the function should return an error.
3 - When an empty value is provided as CustomId, and the entry exists in the table, the entry should be removed, and the function should return success.
4 - When valid data is provided and the entry already exists in the table, the CustomId should be updated to the provided value and the function should return success.
5 - When the current user doesn't have writing permissions for the provided facility, the function should return an error.
6 - When a value that is longer than the maximum permitted length is provided for the CustomId, the function should return an error.
7 - When a SQL Injection attack is attempted through any of the inputs, the function should not fall for the attack and use the provided inputs without further problems.

### Ticket 3 - Create `getCustomAgentId` function

#### Description
Create a new function called getCustomAgentId which can be used to obtain a previously set custom id. This function should:
- Accept AgentId as input.
- Accept FacilityId as input.
- Return an execution status code and a nullable String as result (an Algebraic Data Type if available).

#### Effort estimate
- 4h

#### Acceptance criteria
1 - When valid data is provided to the function, if there is an entry in the table for the provided data, the function returns success, and the current value from the table.
2 - When valid data is provided to the function, if there is no entry in the table for the provided data, the function returns success, and a null value as result.
3 - When AgentId or FacilityId are not found on the database, the function should return an error.
4 - When the current user doesn't have reading permissions for the provided facility, the function should return an error.
5 - When a SQL Injection attack is attempted through any of the inputs, the function should not fall for the attack and use the provided inputs without further problems.


### Ticket 4 - Modify `getShiftsByFacility` to include custom id into the agent's metadata

#### Description
Modify the getShiftsByFacility function to use the newly created function getCustomAgentId to obtain the custom id previously set and update the agent's metadata output to contain this custom id.

#### Effort estimate
- 2h

#### Acceptance criteria
1 - When getting shifts for an Agent whose custom id was previously set by the requesting Facility, the Agent's metadata should include a custom_id field with the mentioned custom id.
2 - When getting shifts for an Agent whose custom id is not set for the given Facility, the Agent's metadata should include a custom_id field with a null value.
3 - AgentMetadata (if existing) class should contain a custom_id of type nullable String.


### Ticket 5 - Modify `generateReport` to include an additional field presenting custom id

#### Description
Modify the generateReport function to include a new field "Custom Id" in the generated report and present the added field from the getShiftsByFacility result. 

#### Effort estimate
8h (depending on the report's sophistication)

#### Acceptance criteria
1 - The generated report should include a new field "Custom Id".
2 - The report's field "Custom Id" should be presented without breaking existing fields.
3 - The report's field "Custom Id" present some readable representation when there is no custom id set (a dash for instance).
4 - The report's field "Custom Id" should present the last set value for the given Agent and Facility.
5 - The report should support without legibility penalties the shortest possible value of CustomId.
6 - The report should support without legibility penalties the longest possible value of CustomId.


### Considerations

All tasks need to be performed in the given sequence, so there is only room for 1 person working on its development concurrently.