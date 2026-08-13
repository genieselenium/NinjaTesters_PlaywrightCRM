@accounts
Feature: Accounts Management

  Scenario: See the Accounts list view
    Given The user is logged in and on the Accounts list view
    When The user looks at the main table on the screen

  Scenario: Search an account by name
    Given The user is logged in and on the Accounts list view
    When The user types a specific name into the search box
    Then The search results show the matching account

  Scenario: Change an account name
    Given The user opens an existing account details page
    When The user types an account name and clicks Save
    Then The top of the page shows the new updated name

  Scenario: Validate account name is required
    Given The user opens an existing account details page
    When The user clears the account name and clicks Save
    Then The user sees "Missing required field: Name"

  Scenario: Filter list by account type
    Given The user is logged in and on the Accounts list view
    When The user selects one specific type from the dropdown

  Scenario: Download accounts to Excel file
    Given The user sees an account name link in the table
    When The user clicks the Export button to download data
    Then An Excel or CSV file is downloaded

@accountsExcel
Scenario: Create accounts using data from Excel
  Given The user is logged in and on the Accounts list view
  When The user creates accounts using the Accounts Excel test data
  Then The accounts should be created successfully



    


  