@login
Feature: User Login
  As a registered user
  I want to log into the application
  So that I can securely access the application dashboard

  Background:
    Given User is on the Login page

  # ----------------------------
  # Positive Login Scenarios
  # ----------------------------

  @smoke @positive
  Scenario: Successful login with valid credentials
    When User enters valid username and password and clicks Login
    Then User is redirected to Dashboard

  @positive
  Scenario: Username with leading spaces
    When User enters username with leading spaces and valid password
    Then System trims spaces and processes login correctly

  @positive
  Scenario: Username with trailing spaces
    When User enters username with trailing spaces and valid password
    Then System trims spaces and processes login correctly

  @positive
  Scenario: Username is case-insensitive (if supported)
    When User enters username in different letter case
    Then Login behavior follows application rules

  @positive
  Scenario: Login using copied and pasted credentials
    When User pastes username and password and clicks Login
    Then Login is processed successfully

  @positive
  Scenario: Press Enter key to login
    Given User has entered valid credentials
    When User presses Enter key
    Then Login is submitted successfully

  # ----------------------------
  # Negative Login Scenarios
  # ----------------------------

  @negative
  Scenario: Login with invalid username
    When User enters invalid username and valid password and clicks Login
    Then Error message is displayed

  @negative
  Scenario: Login with invalid password
    When User enters valid username and invalid password and clicks Login
    Then Error message is displayed

  @negative
  Scenario: Login with both fields empty
    When User clicks Login without entering credentials
    Then Validation message is displayed

  @negative
  Scenario: Login with empty username
    When User enters password only and clicks Login
    Then Username validation message is displayed

  @negative
  Scenario: Login with empty password
    When User enters username only and clicks Login
    Then Password validation message is displayed

  @negative
  Scenario: Password is case-sensitive
    When User enters correct username but password with incorrect case
    Then Login fails with error message

  # ----------------------------
  # Security Scenarios
  # ----------------------------

  @security
  Scenario: Multiple failed login attempts
    When User enters invalid credentials multiple times
    Then Appropriate security message or account lock policy is applied

  @security
  Scenario: Account locked after threshold failures
    Given User account is locked
    When User attempts login with correct credentials
    Then User receives account locked message