@accounts
Feature: Accounts Management Simplified Suite

  Background:
    Given The user logs into the CRM application and navigates straight to the Accounts page

  @smoke
  Scenario: 01 - See the Accounts list view
    Given The user completes the background application routing steps
    When The user looks closely at the main data table on the screen
    Then The list of recorded customer accounts shows up correctly inside the rows

  Scenario: 02 - See account details page
    Given The user spots a specific account name link inside the data table
    When The user clicks on that individual account name hyperlink text
    Then The full system details page for that specific account opens up on screen

  @regression @create
  Scenario: 03 - Create new account easily
    Given The user opens up the blank New Account input form panel
    When The user types a valid account name and clicks the Save button
    Then The account saves perfectly and the user sees the new data profile

  @regression @edit
  Scenario: 04 - Change an account name
    Given The user opens up an existing account details profile page view
    When The user types a brand new account name and clicks the Save button
    Then The top header of the page displays the new updated name text

  @regression @delete
  Scenario: 05 - Delete an account forever
    Given The user opens up an existing account details profile page view
    When The user clicks the Delete button and confirms it on the popup box
    Then The account is completely deleted and disappears from the main list table

  @regression @create
  Scenario: 06 - Block save if name is missing
    Given The user opens up the blank New Account input form panel
    When The user leaves the account name text box empty and clicks Save
    Then A bright red error message shows up saying the name is required

  @regression @create
  Scenario: 07 - Test typing very long text
    Given The user opens up the blank New Account input form panel
    When The user types a huge number of random letters into the fields and clicks Save
    Then The system saves the long text string safely without crashing down

  @regression @search
  Scenario: 08 - Search an account by name
    Given There are many different customer accounts saved inside the CRM system
    When The user types a known valid account name into the filter search box
    Then The data table filters instantly to display only that matching account row

  @regression @search
  Scenario: 09 - Filter list by account type
    Given There are different corporate types of accounts saved inside the list
    When The user selects one specific account type choice from the filter dropdown
    Then The data table updates automatically to display only accounts of that type

  @regression @search
  Scenario: 10 - Filter list by assigned manager
    Given Client accounts are explicitly assigned out to different team members
    When The user selects just one specific manager name from the filter panel
    Then The data screen shifts to show only accounts owned by that manager

  @regression @export
  Scenario: 11 - Download accounts to Excel file
    Given The user views a filtered list of customer accounts on the screen
    When The user clicks on the bulk actions Export button link to download data
    Then A spreadsheet data file downloads containing only those filtered table rows

  @regression @pagination
  Scenario: 12 - Go to the next page of rows
    Given The system contains a very large number of accounts across multiple pages
    When The user clicks directly on the forward navigation Next page arrow button
    Then The subsequent sequence page batch of account rows loads cleanly on screen

  @regression @relationship
  Scenario: 13 - Add a contact to an account
    Given The user opens up an existing account details profile page view
    When The user links a new contact person name record to this account subpanel
    Then The contact person details show up correctly inside the account history sub-grid

  @regression @attachments
  Scenario: 14 - Upload a document file
    Given The user opens up an existing account details profile page view
    When The user uploads a supported document file asset to the notes section
    Then The document file links successfully and appears inside the attachments ledger

  @regression @security
  Scenario: 15 - Stop blocked users from deleting
    Given A restricted user holding basic Read Only access permissions opens an account
    When The restricted user attempts to force trigger a record delete command sequence
    Then An explicit access denied warning shows up and the account record stays safe