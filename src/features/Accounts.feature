Feature: Accounts Management

  Scenario: See the Accounts list view
    Given The user logs in and goes to the Accounts page
    When The user looks at the main table on the screen
    Then The list of customer accounts shows up correctly

  Scenario: See account details page
    Given The user sees an account name link in the table
    When The user clicks on that account name link
    Then The full details page for that account opens up

  Scenario: Open the New Account form
    Given The user is on the Accounts page
    When The user clicks the "Create Account" button
    Then The New Account form is displayed

  Scenario: Cancel account creation after validation error
    Given The user is on the Accounts page
    When The user clicks the "Create Account" button
    Then The New Account form is displayed
    When The user tries to save an account without entering details
    Then The validation error message should appear
    When The user clicks the Cancel button
    Then The user should return to the Accounts list page

  Scenario: Change an account name
    Given The user opens an existing account details page
    When The user changes the account name and clicks Save
    Then The top of the page shows the new updated name

  Scenario: Search for an account by name
    Given There are many different accounts in the system
    When The user searches for "AB Drivers Limited"
    Then The search results show the matching account

  Scenario: Filter list by account type
    Given There are different types of accounts in the list
    When The user selects one specific type from the dropdown
    Then The table changes to show only accounts of that type

  Scenario: Filter list by assigned manager
    Given Accounts are assigned to different team members
    When The user selects one manager name from the filters
    Then The screen shows only accounts owned by that manager
    
  
   