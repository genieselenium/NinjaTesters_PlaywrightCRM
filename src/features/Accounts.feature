@accounts
Feature: Accounts Management

  Background:
    Given The user logs in and goes to the Accounts page

  @smoke
  Scenario: 01 - See the Accounts list view
    Given The user completes the background application routing steps
    When The user looks at the main table on the screen
    Then The list of customer accounts shows up correctly

  Scenario: 02 - See account details page
    Given The user sees an account name link in the table
    When The user clicks on that account name link
    Then The full details page for that account opens up

  @regression @create
  Scenario: 03 - Create new account easily
    Given The user opens the blank "New Account" form
    When The user types an account name and clicks Save
    Then The account is saved and the user sees the new profile

  @regression @edit
  Scenario: 04 - Change an account name
    Given The user opens an existing account details page
    When The user changes the account name and clicks Save
    Then The top of the page shows the new updated name

  @regression @delete
  Scenario: 05 - Delete an account forever
    Given The user opens an existing account details page
    When The user clicks Delete and confirms it on the popup
    Then The account is deleted and disappears from the list

  @regression @create
  Scenario: 06 - Block save if name is missing
    Given The user opens the blank "New Account" form
    When The user leaves the account name blank and clicks Save
    Then An error message shows up saying the name is required

  @regression @create
  Scenario: 07 - Test typing very long text
    Given The user opens the blank "New Account" form
    When The user types a huge number of letters and clicks Save
    Then The system saves the text safely without crashing

  @regression @search
  Scenario: 08 - Search an account by name
    Given There are many different accounts in the system
    When The user types a specific name into the search box
    Then The table filters to show only that matching account

  @regression @search
  Scenario: 09 - Filter list by account type
    Given There are different types of accounts in the list
    When The user selects one specific type from the dropdown
    Then The table changes to show only accounts of that type

  @regression @search
  Scenario: 10 - Filter list by assigned manager
    Given Accounts are assigned to different team members
    When The user selects one manager name from the filters
    Then The screen shows only accounts owned by that manager

  @regression @export
  Scenario: 11 - Download accounts to Excel file
    Given The user has a filtered list of accounts on screen
    When The user clicks the Export button to download data
    Then A file downloads containing only those filtered rows

  @regression @pagination
  Scenario: 12 - Go to the next page of rows
    Given The system has a lot of accounts on multiple pages
    When The user clicks the Next page arrow button
    Then The next set of account rows loads on the screen

  @regression @relationship
  Scenario: 13 - Add a contact to an account
    Given The user opens an account details page
    When The user links a contact person name to this account
    Then The contact person shows up in the account history

  @regression @attachments
  Scenario: 14 - Upload a document file
    Given The user opens an account details page
    When The user uploads a document file to the notes section
    Then The file links successfully and shows up in the notes

  @regression @security
  Scenario: 15 - Stop blocked users from deleting
    Given A user with "Read-Only" access opens an account
    When The user tries to force a delete command
    Then Access is denied and the account stays safe