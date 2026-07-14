@login
Feature: User Login
  As a registered user
  I want to log into the application
  So that I can securely access the application dashboard

  Background:
    Given User is on the login page

  # ----------------------------
  # Positive Login Scenarios
  # ----------------------------

  @smoke @positive
  Scenario: Successful login with valid credentials
    Given User has valid credentials
    When User enters valid credentials and clicks the login button
    Then User is redirected to the dashboard

  @positive
  Scenario: Username with leading spaces
    Given User has a username containing leading spaces
    When User enters the username with leading spaces, a valid password, and clicks the login button
    Then System trims the leading spaces and redirects the user to the dashboard

  @positive
  Scenario: Username with trailing spaces
    Given User has a username containing trailing spaces
    When User enters the username with trailing spaces, a valid password, and clicks the login button
    Then System trims the trailing spaces and redirects the user to the dashboard

  @positive
  Scenario: Username is case insensitive
    Given User has a username in a different letter case
    When User enters the username in a different letter case with a valid password
    Then User is redirected to the dashboard

  @positive
  Scenario: Login using copied and pasted credentials
    Given User has copied valid credentials
    When User pastes the credentials into the username and password fields and clicks the login button
    Then User is redirected to the dashboard

  @positive
  Scenario: Login using Enter key
    Given User has entered valid credentials
    When User presses the Enter key
    Then User is redirected to the dashboard

  @positive
  Scenario: Logout and login again
    Given User is logged into the application
    When User logs out and logs in again using valid credentials
    Then User is redirected to the dashboard

  # ----------------------------
  # Negative Login Scenarios
  # ----------------------------

  @negative
  Scenario: Login with invalid username
    Given User has an invalid username and a valid password
    When User enters the invalid username and clicks the login button
    Then An invalid credentials error message is displayed

  @negative
  Scenario: Login with invalid password
    Given User has a valid username and an invalid password
    When User enters the invalid password and clicks the login button
    Then An invalid credentials error message is displayed

  @negative
  Scenario: Login with invalid username and invalid password
    Given User has an invalid username and an invalid password
    When User enters the invalid credentials and clicks the login button
    Then An invalid credentials error message is displayed

  @negative
  Scenario: Login with empty username
    Given User leaves the username field empty
    When User enters a valid password and clicks the login button
    Then A username validation message is displayed

  @negative
  Scenario: Login with empty password
    Given User leaves the password field empty
    When User enters a valid username and clicks the login button
    Then A password validation message is displayed

  @negative
  Scenario: Login with both username and password empty
    Given User leaves both username and password fields empty
    When User clicks the login button
    Then Validation messages are displayed for both required fields

  @negative
  Scenario: Password is case sensitive
    Given User has a valid username and password with incorrect letter casing
    When User enters the credentials and clicks the login button
    Then An invalid credentials error message is displayed

  # ----------------------------
  # Security Scenarios
  # ----------------------------

  @security
  Scenario: Multiple failed login attempts
    Given User account is not locked
    When User enters invalid credentials multiple consecutive times
    Then A security warning message is displayed

  @security
  Scenario: Account is locked after maximum failed attempts
    Given User account has been locked due to multiple failed login attempts
    When User enters valid credentials and clicks the login button
    Then An account locked message is displayed

  @security
  Scenario: Browser back button after logout
    Given User has logged out successfully
    When User clicks the browser Back button
    Then Protected pages are not displayed
    And User remains on the login page

  @security
  Scenario: Session expires after inactivity
    Given User is logged into the application
    When User remains inactive beyond the session timeout period
    Then User is redirected to the login page
    And A session expired message is displayed

  # ----------------------------
  # Account Status Scenarios
  # ----------------------------

  @account
  Scenario: Login with inactive account
    Given User account is inactive
    When User enters valid inactive account credentials
    Then An account inactive message is displayed

  @account
  Scenario: Login with expired password
    Given User account password has expired
    When User enters valid credentials
    Then User is redirected to the password change page

  # ----------------------------
  # Browser Scenarios
  # ----------------------------

  @browser
  Scenario: Refresh login page before submitting credentials
    Given User has entered username and password
    When User refreshes the browser
    Then Login page reloads successfully
    And User can log in normally

  @browser
  Scenario: Login page loads successfully
    Given User navigates to the application URL
    Then Login page is displayed with username field, password field, and login button

  @browser
  Scenario: Password field masks entered characters
    Given User is on the login page
    When User enters a password
    Then Password characters are masked

  @browser
  Scenario: Login page opens in supported browsers
    Given User opens the application in a supported browser
    Then Login page is displayed successfully