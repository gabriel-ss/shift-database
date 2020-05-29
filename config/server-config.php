<?php
// Database Configurations
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "123456";
const DB_NAME = "testdb";

// Mailer Configurations
const MAILER_CHAR_SET = 'UTF-8';                 // Char set used in emails
const MAILER_HOST = 'shiftdb.com';               // Specify SMTP server
const MAILER_SMTP_AUTH = true;                   // Enable/Disable SMTP authentication
const MAILER_USERNAME = 'noreply@shiftdb.com';   // SMTP username
const MAILER_PASSWORD = '123456';                // SMTP password
const MAILER_SMTP_SECURE = 'tls';                // Enable TLS encryption, `ssl` also accepted
const MAILER_PORT = 587;                         // TCP port to connect to
const MAILER_FROM = 'noreply@shiftdb.com';       // Email displayed to the mail receiver
const MAILER_FROM_NAME = 'Shift DB';             // Name displayed to the mail receiver
